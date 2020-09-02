import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import axios from 'axios';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



export class ControlledEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editorStatement: EditorState.createEmpty(),
			editorQuestion: EditorState.createEmpty(),
			type: '',
			answerOptions: '',
			statement: {
				key: '',
				url: '',
				html: ''
			},
			question: {
				key: '',
				url: '',
				html: ''
			},
			tags: ''
		}
		this.uploadImageStatement = this.uploadImageStatement.bind(this);
		this.uploadImageQuestion = this.uploadImageQuestion.bind(this);
		this.onEditorStatementChange = this.onEditorStatementChange.bind(this);
		this.onEditorQuestionChange = this.onEditorQuestionChange.bind(this);
		this.createItem = this.createItem.bind(this);
		this.changeAnswerOptions = this.changeAnswerOptions.bind(this);
	}

	onEditorStatementChange(editorStatement) {
		this.setState({
			editorStatement,
		});
	};

	onEditorQuestionChange(editorQuestion) {
		this.setState({
			editorQuestion,
		});
	};

	uploadImageStatement(file) {
		return new Promise(
			(resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', 'http://localhost:3001/api/medias/upload/123');
				xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
				const data = new FormData();
				data.append('files', file);
				xhr.send(data);
				xhr.addEventListener('load', () => {
					const response = JSON.parse(xhr.responseText);
					this.setState({
						...this.state,
						statement: {
							key: response[0].key,
							url: response[0].url
						}
					})
					resolve({
						"data": {
							"link": response[0].url
						},
						"success": true,
						"status": 200
					});
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);
	}
	uploadImageQuestion(file) {
		return new Promise(
			(resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', 'http://localhost:3001/api/medias/upload/123');
				xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
				const data = new FormData();
				data.append('files', file);
				xhr.send(data);
				xhr.addEventListener('load', () => {
					const response = JSON.parse(xhr.responseText);
					this.setState({
						...this.state,
						question: {
							key: response[0].key,
							url: response[0].url,
							html: ''
						}
					})
					resolve({
						"data": {
							"link": response[0].url
						},
						"success": true,
						"status": 200
					});
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);
	}


	changeType(e) {
		this.setState({ type: e.target.value })
	}

	changeAnswerOptions(e) {
		this.setState({ answerOptions: e.target.value })
	}

	changeTags(e) {
		this.setState({ tags: e.target.value })
	}

	createItem() {

		let statementHtml = draftToHtml(convertToRaw(this.state.editorStatement.getCurrentContent()));
		let questionHtml = draftToHtml(convertToRaw(this.state.editorQuestion.getCurrentContent()));

		let data = {
			statement: statementHtml,
			question: questionHtml,
			type: this.state.type,
			answerOptions: JSON.parse(this.state.answerOptions),
			tags: JSON.parse(this.state.tags)
		}


		debugger;

		return axios({
			url: 'http://localhost:3001/api/items',
			method: "post",
			data,
			headers: {"Content-Type": "application/json"}
		}).then(res => {
			alert(JSON.stringify(res))
		}).catch(err => {
			alert(JSON.stringify(err))
		})



	}

	render() {
		return (
			<>
				<div>

					<h1>Statement</h1>
					<Editor
						id="statement"
						wrapperClassName="demo-wrapper"
						editorClassName="demo-editor"
						onEditorStateChange={this.onEditorStatementChange}
						toolbar={{
							inline: { inDropdown: true },
							list: { inDropdown: true },
							textAlign: { inDropdown: true },
							link: { inDropdown: true },
							history: { inDropdown: true },
							image: { uploadCallback: this.uploadImageStatement, alt: { present: true, mandatory: true } },
						}}
					/>
				</div>

				<div>

					<h1>Question</h1>
					<Editor
						wrapperClassName="demo-wrapper"
						editorClassName="demo-editor"
						onEditorStateChange={this.onEditorQuestionChange}
						toolbar={{
							inline: { inDropdown: true },
							list: { inDropdown: true },
							textAlign: { inDropdown: true },
							link: { inDropdown: true },
							history: { inDropdown: true },
							image: { uploadCallback: this.uploadImageQuestion, alt: { present: true, mandatory: true } },
						}}
					/>
				</div>

				<div>

					<h1>Type</h1>
					<input type="text" onChange={(e) => this.changeType(e)} />
				</div>

				<div>

					<h1>Answer Optinos</h1>
					<textarea type="text" onChange={(e) => this.changeAnswerOptions(e)} />
				</div>

				<div>

					<h1>Tags</h1>
					<textarea type="text" onChange={(e) => this.changeTags(e)} />
				</div>


				<button onClick={this.createItem}>Create item</button>


			</>

		)
	}
}
