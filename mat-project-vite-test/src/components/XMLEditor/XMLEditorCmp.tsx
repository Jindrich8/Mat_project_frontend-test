import { Editor, EditorProps } from "@monaco-editor/react";
import React, { FC } from "react"
import { Any } from "../../types/types";
import styles from "./XMLEditorCmpStyle.module.css";
// @ts-expect-error the normal import does not work and this import causes the typescript to scream
import XsdManager from '../../../node_modules/monaco-xsd-code-completion/esm/XsdManager';
// @ts-expect-error the normal import does not work and this import causes the typescript to scream
import XsdFeatures from '../../../node_modules/monaco-xsd-code-completion/esm/XsdFeatures';

interface Props {
    editorRef?: React.MutableRefObject<Any>,
    onChange: NonNullable<EditorProps['onChange']>,
    defaultValue?: string,
    className?:string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const schemaXsd = `
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="dokument" type="documentType" />
    <xs:complexType name="documentType">
        <xs:sequence minOccurs="1" maxOccurs="1">
            <xs:element name="popis" type="xs:string" minOccurs="1" maxOccurs="1"  />
            <xs:element name="polozky" type="entriesType" minOccurs="1" maxOccurs="1" />
        </xs:sequence>
    </xs:complexType>
    <xs:complexType name="entriesType">
        <xs:sequence minOccurs="0" maxOccurs="unbounded">
            <xs:choice maxOccurs="unbounded">
                <xs:element name="cviceni" type="exercise" minOccurs="0" maxOccurs="unbounded" />
                <xs:element name="skupina" type="group" minOccurs="0" maxOccurs="unbounded" />
            </xs:choice>
        </xs:sequence>
    </xs:complexType>


    <xs:complexType name="exercise">
        <xs:sequence>
            <xs:element name="instrukce" type="xs:string" />
            <xs:element name="obsah" type="xs:string" />
        </xs:sequence>
        <xs:attribute name="typ" use="required" />
        <xs:attribute name="vaha" use="required" type="xs:positiveInteger" />
    </xs:complexType>

    <xs:complexType name="group">
        <xs:sequence>
            <xs:element name="zdroje" type="resourcesType" />
            <xs:element name="clenove" type="membersType">
            </xs:element>
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="group2">
        <xs:sequence>
            <xs:element name="zdroje" type="resourcesType" />
            <xs:element name="clenove" type="membersType">
            </xs:element>
        </xs:sequence>
    </xs:complexType>
  
    <xs:complexType name="resourcesType">
        <xs:sequence>
            <xs:element name="zdroj"
                maxOccurs="unbounded" type="xs:string" />
        </xs:sequence>
    </xs:complexType>
    <xs:complexType name="membersType">
        <xs:sequence>
            <xs:choice maxOccurs="unbounded">
                <xs:element name="cviceni"
                    type="exercise"
                    maxOccurs="unbounded" />
                <xs:element name="skupina" type="group2" maxOccurs="unbounded" />
            </xs:choice>
        </xs:sequence>
    </xs:complexType>
</xs:schema>
`;

const XMLEditorCmp: FC<Props> = ({ onChange, defaultValue, editorRef,className }) => {

    const onMount: EditorProps['onMount'] = React.useCallback((editor: Any,monaco:Any) => {
        if (editorRef) {
            editorRef.current = editor;
        }
        const xsdManager = new XsdManager(editor);
        
        xsdManager.set({
          path: "schema.xsd",
          value: schemaXsd, // this is just a const containing the demo xsd from above
          alwaysInclude: true,
        });

        // xsdManager.set({
        //     path: "example.xsd",
        //     value: exampleXsd, // this is just a const containing the demo xsd from above
        //     alwaysInclude: true,
        //   });
    
        const xsdFeatures = new XsdFeatures(
          xsdManager,
          monaco,
          editor
        );
    
        xsdFeatures.addCompletion();
        xsdFeatures.addValidation();
        xsdFeatures.addGenerateAction();
        xsdFeatures.addReformatAction();
    }, [editorRef]);

    return (
        <Editor
            defaultValue={defaultValue}
            className={styles.editor+' '+className}
            height={'100%'}
            width={'100%'}
            language={'xml'}
            
            onMount={onMount}
            onChange={onChange} />
    )
};

export { XMLEditorCmp, type Props as XMLEditorCmpProps };
