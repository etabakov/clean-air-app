export class Sensor {
    constructor(
        public id: number,
        public timestamp: Date,
        public latitude: string,
        public longitude: string,
        public f100: number,
        public f25: number,
    ) {}
}