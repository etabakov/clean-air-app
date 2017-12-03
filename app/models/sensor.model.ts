export interface Sensor {
    id: number;

    latitude: number;
    longitude: number;

    isFav?: boolean;

    measurements: Measurement[];
}

export interface Measurement {
    timestamp: Date;
    f100: number;
    f25: number;
}
