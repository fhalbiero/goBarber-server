
interface ITemplateVariables {
    [key: string]: string | number;
}


export default interface IPareceMailTemplateDTO {
    file: string;
    variables: ITemplateVariables;
}