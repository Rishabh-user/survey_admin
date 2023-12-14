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
        public group: number = 0,
        public sort: number = 0,
        public selected: boolean = false
    ) { }
}