"use client";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { lineNumbers, ViewUpdate } from "@codemirror/view";
import { EditorView } from "codemirror";
import {
  html,
  htmlCompletionSource,
  autoCloseTags,
} from "@codemirror/lang-html";
import { css, cssCompletionSource } from "@codemirror/lang-css";
import { EditorState } from "@codemirror/state";
import { autocompletion } from "@codemirror/autocomplete";
import { birdsOfParadise } from "thememirror";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import styled from "styled-components";
import { Divider } from "@nextui-org/divider";

export const CodePreviewer = styled.div`
  width: 400px;
  height: 400px;
  overflow: auto;
  margin-left: .75rem;
`;

export const StyledIframe = styled.iframe`
  background-color: "fafafafa";
  height: 400px;
  width: 400px;
  border-radius: 14px !important;
`;
const CodeEditor = () => {
  const htmlEditorRef = useRef<
    Element | DocumentFragment | LegacyRef<HTMLDivElement> | undefined
  >();
  const cssEditorRef = useRef<
    Element | DocumentFragment | LegacyRef<HTMLDivElement> | undefined
  >();
  const iframeRef = useRef<HTMLIFrameElement>();

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");

  useEffect(() => {
    const htmlExtension = [
      lineNumbers(),
      autocompletion({
        override: [htmlCompletionSource],
      }),
      autoCloseTags,
    ];
    const cssExtension = [
      lineNumbers(),
      autocompletion({
        override: [cssCompletionSource],
      }),
    ];

    const htmlEditor = new EditorView({
      state: EditorState.create({
        doc: htmlCode,
        extensions: [
          html(),
          htmlExtension,
          birdsOfParadise,
          EditorView.updateListener.of((v: ViewUpdate) => {
            if (v.docChanged) {
              setHtmlCode(v.state.doc.toString());
            }
          }),
        ],
      }),
      parent: htmlEditorRef.current,
    });

    const cssEditor = new EditorView({
      state: EditorState.create({
        doc: cssCode,
        extensions: [
          css(),
          cssExtension,
          birdsOfParadise,
          EditorView.updateListener.of((v: ViewUpdate) => {
            if (v.docChanged) {
              setCssCode(v.state.doc.toString());
            }
          }),
        ],
      }),
      parent: cssEditorRef.current,
    });

    return () => {
      htmlEditor.destroy();
      cssEditor.destroy();
    };
  }, []);

  useEffect(() => {
    const updateIframe = () => {
      if (!iframeRef.current || !iframeRef.current.contentDocument) return;
      const iframeDoc = iframeRef.current.contentDocument;

      iframeDoc.body.innerHTML = htmlCode;
      const styleElement = iframeDoc.createElement("style");

      styleElement.textContent = cssCode;
      iframeDoc.head.innerHTML = "";
      iframeDoc.head.appendChild(styleElement);
    };

    updateIframe();
  }, [htmlCode, cssCode]); // Appel de la fonction chaque fois que htmlCode ou cssCode change

  return (
    <section className="flex gap-3">
      <Card className="max-w-[400px] w-[400px]">
        <CardHeader className="flex gap-3">
          <p className="text-primary text-3xl">html</p>
        </CardHeader>
        <Divider/>
        <CardBody>
          <div ref={htmlEditorRef} className="w-200" />
        </CardBody>
      </Card>
      <Card className="max-w-[400px] w-[400px]">
        <CardHeader className="flex gap-3">
          <p className="text-primary text-3xl">css</p>
        </CardHeader>
        <Divider/>
        <CardBody className="editor">
          <div ref={cssEditorRef} className="w-200" />
        </CardBody>
      </Card>
      <Card className="max-w-[400px] w-[400px]">
        <CardHeader className="flex gap-3">
          <p className="text-primary text-3xl">Result</p>
        </CardHeader>
        <Divider />
        <br />
        <StyledIframe
          ref={iframeRef}
          frameBorder="0"
          id="preview"
          sandbox="allow-same-origin"
          scrolling="no"
          title="editor"
        />
      </Card>
    </section>
  );
};

export default CodeEditor;
