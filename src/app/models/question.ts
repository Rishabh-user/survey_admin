import { Logic } from "./logic";
import { MatrixHeader, Option } from "./option";

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
    public colorCode: string =''
    public genericTypeId: number = 0
    public isGrouping: boolean = false;
    public sort: number = 1;
    public isLogic: boolean = false;
    public options: Option[] = [];
    public logics: Logic[] = []
    public shouldAddOption: boolean = false
    public isScreening: boolean = false
    public screeningRedirectUrl: string = ""
    public openEndedType: string = ""
    public youtubeUrl: string = ''
    public description: string = ''
    public genericKey: number = 0
    public isNumeric: boolean = false
    public isAlphabet: boolean = false
    public textLimit: number = 0
    public questionSummery: string = ''
    public matrixHeader: MatrixHeader[]=[]
}
