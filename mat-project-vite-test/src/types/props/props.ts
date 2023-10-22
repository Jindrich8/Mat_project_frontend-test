import { PrefixedRecord } from "../helpers/helpers";

type Dataset = PrefixedRecord<'data-',string>;

interface InputBeh{
    inputDataset?:Dataset
}

interface BasicStyledCmpProps {
    style?:React.CSSProperties
}

interface BasicStyledWChildrenCmpProps extends React.PropsWithChildren, BasicStyledCmpProps {

}

const defaultHiddenSpanStyle:React.CSSProperties = {
    visibility: 'hidden',
    opacity: '0',
    height: '0',
    position: 'absolute',
    whiteSpace: 'pre',
    overflow: 'hidden'
};

export {type Dataset, type InputBeh,type BasicStyledCmpProps,type BasicStyledWChildrenCmpProps,defaultHiddenSpanStyle};

