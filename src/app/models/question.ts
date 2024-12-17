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
    public audio: any = '';
    public video: string = '';
    public image: string = '';
    public status: string = '';
    public createdDate: string = '';
    public modifiedDate: string = '';
    public colorCode: string ='';
    public isRequired: boolean = true
    public qNo: string ="";
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
    public youtubeUrl: string = '';
    public description: string = '';
    public genericKey: number = 0;
    public isNumeric: boolean = false;
    public isAlphabet: boolean = false;
    public textLimit: any = 0;
    public minLimit: number = 0;
    public timeOut: number = 0;
    public isHidden: boolean= false;
    public questionSummery: string = '';
    public matrixHeader: MatrixHeader[]=[];
    public questionToolTip: string = '';
    public inputTextArea: boolean = false;
    public inputTextType: boolean = false;
    public isListRow1:boolean = false;
    public isListRow2: boolean = false;
    public sL_Flag_Column: boolean = false;
}
