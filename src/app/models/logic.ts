export class Logic {
    constructor(
        public id: number = 0,
        public questionId: number = 0,
        public ifId: number = 0,
        public ifExpected: string = '',
        public thanId: number = 0,
        public thanExpected: number = 0,
        public elseId: number = 0,
        public elseExpected: number = 0
    ) { }
}

export class childData {
    constructor(
        public id: number = 0,
        public surveyId: number = 0,
        public questionId: number = 0,
        public groupId: number = 0,
        public isParent: boolean = false ,
        public status: string = 'ACT'
    ) { }
}

export class Pipe {
    constructor(
        public id: number = 0,
        public surveyId: number = 0,
        public questionId: number = 0,
        public groupId: number = 0,
        public isParent: boolean = true ,
        public status: string = 'ACT',
        public childData: childData[] = []
    ) { }
}