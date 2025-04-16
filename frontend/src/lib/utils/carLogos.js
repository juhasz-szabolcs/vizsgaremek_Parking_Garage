// Car logo mapping
const logoMap = {
    'toyota': 'https://www.carlogos.org/car-logos/toyota-logo.png',
    'honda': 'https://www.carlogos.org/car-logos/honda-logo.png',
    'ford': 'https://www.carlogos.org/car-logos/ford-logo.png',
    'bmw': 'https://www.carlogos.org/car-logos/bmw-logo.png',
    'audi': 'https://www.carlogos.org/car-logos/audi-logo.png',
    'volkswagen': 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
    'mercedes': 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
    'hyundai': 'https://www.carlogos.org/car-logos/hyundai-logo.png',
    'opel': 'https://www.carlogos.org/car-logos/opel-logo.png',
    'peugeot': 'https://www.carlogos.org/car-logos/peugeot-logo.png',
    'fiat': 'https://www.carlogos.org/car-logos/fiat-logo.png',
    'skoda': 'https://www.carlogos.org/car-logos/skoda-logo.png',
    'seat': 'https://www.carlogos.org/car-logos/seat-logo.png',
    'renault': 'https://www.carlogos.org/car-logos/renault-logo.png',
    'alfa-romeo': 'https://www.carlogos.org/car-logos/alfa-romeo-logo.png',
    'alfa romeo': 'https://www.carlogos.org/car-logos/alfa-romeo-logo.png',
    'kia': 'https://www.carlogos.org/car-logos/kia-logo.png',
    'landrover': 'https://www.carlogos.org/car-logos/landrover-logo.png',
    'jeep': 'https://www.carlogos.org/car-logos/jeep-logo.png',
    'mazda': 'https://www.carlogos.org/car-logos/mazda-logo.png',
    'mitsubishi': 'https://www.carlogos.org/car-logos/mitsubishi-logo.png',
    'nissan': 'https://www.carlogos.org/car-logos/nissan-logo.png',
    'subaru': 'https://www.carlogos.org/car-logos/subaru-logo.png',
    'tesla': 'https://www.carlogos.org/car-logos/tesla-logo.png',
    'porsche': 'https://www.carlogos.org/car-logos/porsche-logo.png',
    'volvo': 'https://www.carlogos.org/car-logos/volvo-logo.png',
    'lexus': 'https://www.carlogos.org/car-logos/lexus-logo.png',
    'jaguar': 'https://www.carlogos.org/car-logos/jaguar-logo.png',
    'infiniti': 'https://www.carlogos.org/car-logos/infiniti-logo.png',
    'cadillac': 'https://www.carlogos.org/car-logos/cadillac-logo.png',
    'gmc': 'https://www.carlogos.org/car-logos/gmc-logo.png',
    'dodge': 'https://www.carlogos.org/car-logos/dodge-logo.png',
    'chrysler': 'https://www.carlogos.org/car-logos/chrysler-logo.png',
    'ferrari': 'https://www.carlogos.org/car-logos/ferrari-logo.png',
    'lamborghini': 'https://www.carlogos.org/car-logos/lamborghini-logo.png',
    'mclaren': 'https://www.carlogos.org/car-logos/mclaren-logo.png',
    'bugatti': 'https://www.carlogos.org/car-logos/bugatti-logo.png',
    'rolls-royce': 'https://www.carlogos.org/car-logos/rolls-royce-logo.png',
    'maserati': 'https://www.carlogos.org/car-logos/maserati-logo.png',
    'mini': 'https://www.carlogos.org/car-logos/mini-logo.png',
    'hummer': 'https://www.carlogos.org/car-logos/hummer-logo.png'
};

/**
 * Returns the logo URL for a given car brand
 * @param {string} brand - The car brand name
 * @returns {string} - The URL of the car brand's logo
 */
export function getCarLogo(brand) {
    if (!brand) return 'https://www.carlogos.org/car-logos/default-car-logo.png';
    
    const brandLower = brand.toLowerCase();
    return logoMap[brandLower] || 'https://www.carlogos.org/car-logos/default-car-logo.png';
} 