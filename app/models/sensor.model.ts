export class Sensor {
    constructor(
        public id: number,
        public timestamp: Date,
        public latitude: number,
        public longitude: number,
        public f100: number,
        public f25: number,
        public isFav?: boolean
    ) {}
}
