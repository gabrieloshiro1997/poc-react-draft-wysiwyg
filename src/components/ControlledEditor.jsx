import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function uploadImageCallBack(file) {
	return new Promise(
	  (resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:3001/api/items/upload-file/123');
		const data = new FormData();
		data.append('files', file);
		xhr.send(data);
		xhr.addEventListener('load', () => {
		  const response = JSON.parse(xhr.responseText);
		  resolve(response);
		});
		xhr.addEventListener('error', () => {
		  const error = JSON.parse(xhr.responseText);
		  reject(error);
		});
	  }
	);
  }
  
export const ControlledEditor = () => (
	<Editor
	  wrapperClassName="demo-wrapper"
	  editorClassName="demo-editor"
	  toolbar={{
		inline: { inDropdown: true },
		list: { inDropdown: true },
		textAlign: { inDropdown: true },
		link: { inDropdown: true },
		history: { inDropdown: true },
		image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
	  }}
	/>
  );