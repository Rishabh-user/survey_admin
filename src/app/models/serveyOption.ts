export class serveyOption {
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
        public isFlipNumber: boolean = false,
        public group: number | null = null,
        public sort: number = 0,
        public selected: boolean = false,
        public isVisible: boolean = false,
        public isSelected: boolean = false,
        public isFixed: boolean = false,
        public imageAdded: boolean = false,
        public optionToolTip: string = '',
        public optionDescription:string = ''

    ) { }
}