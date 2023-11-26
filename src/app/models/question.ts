import { Logic } from "./logic";
import { Option } from "./option";

export class Question {
    public id: number = 0;
    public question: string = '';
    public questionTypeId: number = 0;
    public surveyTypeId: number = 0;
    public questionTypeName: string = '';
    public surveyTypeName: string = '';
    public piping: string = '';
    public audio: string = '';
    public video: string = '';
    public image: string = '';
    public status: string = '';
    public createdDate: string = '';
    public modifiedDate: string = '';
    public isGrouping: boolean = false;
    public sort: number = 0;
    public isLogic: boolean = false;
    public options: Option[] = [];
    public logics: Logic[] = []
}
