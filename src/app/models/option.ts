export class Option {
    constructor(
        public id: number = 0,
        public option: string = '',
        public image: string = '',
        public createdDate: string = '',
        public modifiedDate: string = '',
        public keyword: string = '',
        public status: string = '',
        public isRandomize: boolean = false,
        public isExcluded: boolean = false,
        public group: number | null = null,
        public sort: number = 0,
        public selected: boolean = false,
        public isVisible: boolean = false,
        public isSelected: boolean = false,
        public isFixed: boolean = false,
        

    ) { }
}

export class MatrixHeader {
    constructor( 
    public id: number=0,
    public header: string='',
    public status: string='',
    public questionId: number = 0,
    public sort: number=0,
    public createdDate: string = '',
    public modifiedDate: string = '',
    public headerToolTip:string = '',
    public headerDescription:string = ''
    ){}
}