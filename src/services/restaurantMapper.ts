import type {Restaurant, TimeSlot} from '../types/restaurant';

export interface BackendRestaurant {
    id: string;
    name: string;
    cuisineType: string;
    city: string;
    address: string;
    defaultPreparationTimeMinutes: number;
    isOpen: boolean;
    availableDishesCount?: number;
    // These might come in detail view but not in list
    email?: string;
    pictureUrls?: string[];
    openingHours?: {
        [key: string]: string;
    };
    street?: string;
    postalCode?: string;
}

export function mapBackendRestaurant(backend: BackendRestaurant): Restaurant {
    const parseOpeningHours = (ohObj: { [key: string]: string } | undefined) => {
        if (!ohObj) {
            return {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            };
        }

        const parseDay = (timeStr: string | undefined): TimeSlot[] => {
            if (!timeStr || !timeStr.includes('-')) return [];
            const [open, close] = timeStr.split('-');
            return [{ open: open.trim(), close: close.trim() }];
        };

        return {
            monday: parseDay(ohObj['monday']),
            tuesday: parseDay(ohObj['tuesday']),
            wednesday: parseDay(ohObj['wednesday']),
            thursday: parseDay(ohObj['thursday']),
            friday: parseDay(ohObj['friday']),
            saturday: parseDay(ohObj['saturday']),
            sunday: parseDay(ohObj['sunday']),
        };
    };

    return {
        id: backend.id,
        name: backend.name || 'Unknown Restaurant',
        address: {
            street: backend.address || '',
            number: '',
            postalCode: backend.postalCode || '',
            city: backend.city || '',
            country: '',
        },
        contactEmail: backend.email || '',
        pictures: backend.pictureUrls || [],
        cuisineType: backend.cuisineType || '',
        defaultPrepTime: Math.round(backend.defaultPreparationTimeMinutes || 0),
        openingHours: parseOpeningHours(backend.openingHours),
        isOpen: backend.isOpen ?? false,
        avgMenuPrice: 0,
        createdAt: '',
        updatedAt: '',
    };
}
