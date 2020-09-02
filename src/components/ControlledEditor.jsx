import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



export class ControlledEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editorState: EditorState.createEmpty(),
		  }
		this.uploadImageCallBack = this.uploadImageCallBack.bind(this);
		this.onEditorStateChange = this.onEditorStateChange.bind(this);
	}
	
	onEditorStateChange(editorState) {
		this.setState({
		  editorState,
		});
	  };

	uploadImageCallBack(file){
	  return new Promise(
		(resolve, reject) => {
		  const xhr = new XMLHttpRequest();
		  xhr.open('POST', 'http://localhost:3001/api/items/upload-file/123');
		  xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
		  const data = new FormData();
		  data.append('files', file);
		  xhr.send(data);
		  xhr.addEventListener('load', () => {
			const response = JSON.parse(xhr.responseText);
			resolve({
				"data": {
					"id": "SbBGk",
					"title": null,
					"description": null,
					"datetime": 1341533193,
					"type": "image/jpeg",
					"animated": false,
					"width": 2559,
					"height": 1439,
					"size": 521916,
					"views": 1,
					"bandwidth": 521916,
					"deletehash": "eYZd3NNJHsbreD1",
					"section": null,
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
	render() {
		return(
			<>
			<Editor
			  wrapperClassName="demo-wrapper"
			  editorClassName="demo-editor"
			  onEditorStateChange={this.onEditorStateChange}
			  toolbar={{
				inline: { inDropdown: true },
				list: { inDropdown: true },
				textAlign: { inDropdown: true },
				link: { inDropdown: true },
				history: { inDropdown: true },
				image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
			  }}
			/>
			 <textarea
          disabled
          value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}
        />
			</>

		)
	}
}
