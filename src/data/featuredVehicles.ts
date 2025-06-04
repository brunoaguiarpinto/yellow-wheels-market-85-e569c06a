
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: number;
  fuel: string;
}

export const featuredVehicles: Vehicle[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla XEi",
    year: 2023,
    price: 159900,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60",
    mileage: 12000,
    fuel: "Flex"
  }, 
  {
    id: 2,
    brand: "Honda",
    model: "Civic Touring",
    year: 2022,
    price: 175000,
    image: "https://images.unsplash.com/photo-1606611013653-84667c136413?w=500&auto=format&fit=crop&q=60",
    mileage: 22000,
    fuel: "Flex"
  }, 
  {
    id: 3,
    brand: "BMW",
    model: "320i Sport",
    year: 2023,
    price: 289900,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=60",
    mileage: 8000,
    fuel: "Gasolina"
  },
  {
    id: 4,
    brand: "Mercedes-Benz",
    model: "C200 AMG Line",
    year: 2023,
    price: 385000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&auto=format&fit=crop&q=60",
    mileage: 5000,
    fuel: "Gasolina"
  },
  {
    id: 5,
    brand: "Audi",
    model: "Q5 Prestige",
    year: 2022,
    price: 359900,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&auto=format&fit=crop&q=60",
    mileage: 18000,
    fuel: "Gasolina"
  },
  {
    id: 6,
    brand: "Volkswagen",
    model: "Tiguan R-Line",
    year: 2023,
    price: 249900,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop&q=60",
    mileage: 9500,
    fuel: "Flex"
  }
];
