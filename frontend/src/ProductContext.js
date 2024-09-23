import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new context for products
const ProductContext = createContext();

// Create a custom hook to use the ProductContext
export const useProduct = () => {
  return useContext(ProductContext);
};

// ProductProvider component to wrap around parts of your app that need product state
export const ProductProvider = ({ children }) => {
  // Initialize state from localStorage or use default values
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [
      // Smart Doorbells
      {
    id: 1,
    name: "Ring Video Doorbell",
    price: 149,
    image: '/images/doorbell/RingVideoDoorbell.jpg',
    description: '1080p HD video doorbell with two-way talk, motion detection, and customizable motion zones.',
    category: 'Smart Doorbells',
    published: true,
    accessories: [
      { id: 101, name: "Ring Chime", price: 29, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
      { id: 102, name: "Ring Solar Charger", price: 49, image: '/images/doorbell/accessories/Ring Solar Panel.jpeg' },
      { id: 103, name: "Ring Plug Adapter", price: 19, image: '/images/doorbell/accessories/Ring PlugAdapter.jpeg' }
    ]
  },
  {
    id: 2,
    name: "Nest Hello",
    price: 229,
    image: '/images/doorbell/NestHello.jpeg',
    description: 'HD video doorbell with night vision, two-way audio, and intelligent alerts.',
    category: 'Smart Doorbells',
    published: true,
    accessories: [
      { id: 104, name: "Nest Chime Connector", price: 39, image: '/images/doorbell/accessories/Ring Chime.jpeg' },
      { id: 105, name: "Nest Angle Mount", price: 25, image: '/images/doorbell/accessories/NestAngleMount.jpeg' },
      { id: 106, name: "Nest Solar Panel", price: 59, image: '/images/doorbell/accessories/NestSolarPanel.jpeg' }
    ]
  },
  {
    id: 3,
    name: "Eufy Security Video Doorbell",
    price: 159,
    image: '/images/doorbell/EufyVideoDoorbell.jpg',
    description: 'Wireless 2K video doorbell with AI facial recognition and secure local storage.',
    category: 'Smart Doorbells',
    published: true,
    accessories: [
      { id: 107, name: "Eufy HomeBase", price: 79, image: '/images/doorbell/accessories/EufyHomeBase.jpeg' },
      { id: 108, name: "Eufy Solar Panel", price: 39, image: '/images/doorbell/accessories/EufySolarPanel.jpeg' },
      { id: 109, name: "Eufy Wall Mount", price: 19, image: '/images/doorbell/accessories/EufyWallMount.jpeg' }
    ]
  },
  {
    id: 4,
    name: "Arlo Video Doorbell",
    price: 179,
    image: '/images/doorbell/ArloVideoDoorbell.jpg',
    description: 'Weather-resistant smart doorbell with motion detection and live streaming.',
    category: 'Smart Doorbells',
    published: true,
    accessories: [
      { id: 110, name: "Arlo Chime", price: 29, image: '/images/doorbell/accessories/ArloChime.jpeg' },
      { id: 111, name: "Arlo Solar Panel", price: 45, image: '/images/doorbell/accessories/ArloSolarPanel.jpeg' },
      { id: 112, name: "Arlo Doorbell Mount", price: 19, image: '/images/doorbell/accessories/ArloDoorbellMount.jpeg' }
    ]
  },
  {
    id: 5,
    name: "RemoBell S",
    price: 169,
    image: '/images/doorbell/SimpliSafeVideoDoorbell.jpg',
    description: 'Smart doorbell with ultra-wide field of view, two-way audio, and heat-sensing motion detection.',
    category: 'Smart Doorbells',
    published: true,
    accessories: [
      { id: 113, name: "SimpliSafe Chime", price: 35, image: '/images/doorbell/accessories/SimpliSafeChime.jpeg' },
      { id: 114, name: "SimpliSafe Solar Charger", price: 55, image: '/images/doorbell/accessories/SimpliSafeSolarPanel.jpeg' },
      { id: 115, name: "SimpliSafe Angle Mount", price: 25, image: '/images/doorbell/accessories/SimpliSafeAngleMount.jpeg' }
    ]
  },
  // Smart DoorLocks
  {
    id: 6,
    name: "August Smart Lock",
    price: 199,
    image: '/images/doorlock/AugustSmartLock.jpg',
    description: 'Wi-Fi smart lock with remote access, voice control, and auto-locking features.',
    category: 'Smart DoorLocks',
    published: true,
    accessories: [
      { id: 201, name: "August Connect", price: 79, image: '/images/doorlock/accessories/AugustConnect.jpg' },
      { id: 202, name: "August Smart Keypad", price: 59, image: '/images/doorlock/accessories/AugustSmartKeypad.jpg' },
      { id: 203, name: "August DoorSense", price: 29, image: '/images/doorlock/accessories/AugustDoorSense.jpg' }
    ]
  },
  {
    id: 7,
    name: "Schlage Encode",
    price: 249,
    image: '/images/doorlock/SchlageEncode.jpg',
    description: 'Smart deadbolt lock with built-in Wi-Fi and Amazon Key compatibility.',
    category: 'Smart DoorLocks',
    published: true,
    accessories: [
      { id: 204, name: "Schlage SmartKeypad", price: 99, image: '/images/doorlock/accessories/SchlageSmartKeypad.jpg' },
      { id: 205, name: "Schlage Door Alarm", price: 45, image: '/images/doorlock/accessories/SchlageDoorAlarm.jpg' },
      { id: 206, name: "Schlage Wi-Fi Bridge", price: 39, image: '/images/doorlock/accessories/SchlageWiFiBridge.jpg' }
    ]
  },
  {
    id: 8,
    name: "Yale Assure Lock",
    price: 229,
    image: '/images/doorlock/YaleAssureLock.jpg',
    description: 'Key-free smart lock with touchscreen and Bluetooth integration.',
    category: 'Smart DoorLocks',
    published: true,
    accessories: [
      { id: 207, name: "Yale Connect Wi-Fi Bridge", price: 59, image: '/images/doorlock/accessories/YaleConnectBridge.jpg' },
      { id: 208, name: "Yale Smart Keypad", price: 49, image: '/images/doorlock/accessories/YaleSmartKeypad.jpg' },
      { id: 209, name: "Yale DoorSense", price: 19, image: '/images/doorlock/accessories/YaleDoorSense.jpg' }
    ]
  },
  {
    id: 9,
    name: "Level Lock",
    price: 199,
    image: '/images/doorlock/LevelLock.jpg',
    description: 'Compact and invisible smart lock with remote access and voice control.',
    category: 'Smart DoorLocks',
    published: true,
    accessories: [
      { id: 210, name: "Level Lock Bridge", price: 69, image: '/images/doorlock/accessories/LevelLockBridge.jpg' },
      { id: 211, name: "Level SmartKeypad", price: 39, image: '/images/doorlock/accessories/LevelSmartKeypad.jpg' },
      { id: 212, name: "Level Lock Battery", price: 19, image: '/images/doorlock/accessories/LevelLockBattery.jpg' }
    ]
  },
  {
    id: 10,
    name: "Kwikset Halo",
    price: 179,
    image: '/images/doorlock/KwiksetHalo.jpg',
    description: 'Smart Wi-Fi deadbolt with remote control and integration with Alexa and Google Assistant.',
    category: 'Smart DoorLocks',
    published: true,
    accessories: [
      { id: 213, name: "Kwikset Halo SmartKeypad", price: 49, image: '/images/doorlock/accessories/KwiksetHaloSmartKeypad.jpg' },
      { id: 214, name: "Kwikset Halo Wi-Fi Bridge", price: 39, image: '/images/doorlock/accessories/KwiksetHaloWiFiBridge.jpg' },
      { id: 215, name: "Kwikset Halo Backup Key", price: 19, image: '/images/doorlock/accessories/KwiksetHaloBackupKey.jpg' }
    ]
  },
    // Smart Lightings
    {
      id: 13,
      name: "Philips Hue White and Color Ambiance",
      price: 159,
      image: '/images/lighting/Philips Hue Bulb.jpeg',
      description: 'Smart LED lighting with 16 million colors and shades of white. Fully controllable via app, voice, or smart home systems.',
      category: 'Smart Lightings',
      published: true,
      accessories: [
        { id: 401, name: "Philips Hue Dimmer Switch", price: 35, image: '/images/lighting/accessories/PhilipsHueDimmerSwitch.jpg' },
        { id: 402, name: "Philips Hue Motion Sensor", price: 40, image: '/images/lighting/accessories/PhilipsHueMotionSensor.jpg' }
      ]
    },
    {
      id: 14,
      name: "LIFX Smart Bulb",
      price: 89,
      image: '/images/lighting/LIFX Smart Bulb.jpeg',
      description: 'Wi-Fi-enabled smart bulb with adjustable brightness and 16 million color options. No hub required.',
      category: 'Smart Lightings',
      published: true,
      accessories: [
        { id: 403, name: "LIFX Beam", price: 149, image: '/images/lighting/accessories/LIFXBeam.jpg' },
        { id: 404, name: "LIFX Z LED Strip", price: 89, image: '/images/lighting/accessories/LIFXZLEDStrip.jpg' }
      ]
    },
    {
      id: 15,
      name: "Sengled Smart Bulb",
      price: 49,
      image: '/images/lighting/Sengled Smart Bulb.jpg',
      description: 'Affordable smart bulb with voice control via Alexa and Google Assistant. Tunable white and color settings.',
      category: 'Smart Lightings',
      published: true,
      accessories: [
        { id: 405, name: "Sengled Smart Hub", price: 29, image: '/images/lighting/accessories/SengledSmartHub.jpg' },
        { id: 406, name: "Sengled Motion Sensor", price: 45, image: '/images/lighting/accessories/SengledMotionSensor.jpg' }
      ]
    },
    {
      id: 16,
      name: "TP-Link Kasa",
      price: 199,
      image: '/images/lighting/"TP-Link Kasa".jpeg',
      description: 'Customizable smart LED panels with voice control. Modular design with millions of color options.',
      category: 'Smart Lightings',
      published: true,
      accessories: [
        { id: 407, name: "Nanoleaf Controller", price: 49, image: '/images/lighting/accessories/NanoleafController.jpg' }
      ]
    },
    {
      id: 17,
      name: "Wyze Bulb",
      price: 39,
      image: '/images/lighting/Wyze Bulb.webp',
      description: 'Smart bulb with Bluetooth control, adjustable white and color settings, and no hub required.',
      category: 'Smart Lightings',
      published: true,
      accessories: []
    },
  
    // Smart Thermostats
    {
      id: 18,
      name: "Nest Learning Thermostat",
      price: 249,
      image: '/images/thermostat/Nest Learning Thermostat.jpg',
      description: 'Smart thermostat with auto-scheduling, energy-saving features, and remote control via app or voice assistant.',
      category: 'Smart Thermostats',
      published: true,
      accessories: [
        { id: 501, name: "Nest Temperature Sensor", price: 39, image: '/images/thermostat/accessories/NestTemperatureSensor.jpg' },
        { id: 502, name: "Nest Wall Plate", price: 19, image: '/images/thermostat/accessories/NestWallPlate.jpg' }
      ]
    },
    {
      id: 19,
      name: "Ecobee SmartThermostat with Voice Control",
      price: 229,
      image: '/images/thermostat/EcobeeSmartThermostat.jpg',
      description: 'Smart thermostat with built-in Alexa, voice control, and energy-saving features. Includes room sensors for better comfort.',
      category: 'Smart Thermostats',
      published: true,
      accessories: [
        { id: 503, name: "Ecobee Room Sensor", price: 79, image: '/images/thermostat/accessories/EcobeeRoomSensor.jpg' }
      ]
    },
    {
      id: 20,
      name: "Honeywell Home T9 Smart Thermostat",
      price: 199,
      image: '/images/thermostat/Honeywell Lyric T5.jpg',
      description: 'Smart thermostat with room sensors, remote app control, and geofencing features for efficient energy usage.',
      category: 'Smart Thermostats',
      published: true,
      accessories: []
    },
    {
      id: 21,
      name: "Lux Kono",
      price: 69,
      image: '/images/thermostat/Lux Kono.jpg',
      description: 'Affordable smart thermostat with remote control, energy-saving scheduling, and app integration.',
      category: 'Smart Thermostats',
      published: true,
      accessories: []
    },
    {
      id: 22,
      name: "Emerson Sensi Touch Wi-Fi Thermostat",
      price: 169,
      image: '/images/thermostat/EmersonSensi.jpg',
      description: 'Smart thermostat with touchscreen display, voice control, and compatibility with most HVAC systems.',
      category: 'Smart Thermostats',
      published: true,
      accessories: []
    },
    {
        id: 23,
        name: "Amazon Echo Dot (4th Gen)",
        price: 49,
        image: '/images/speakers/Amazon Echo.jpg',
        description: 'Compact smart speaker with Alexa voice control. Provides 360-degree audio and integrates with other smart home devices.',
        category: 'Smart Speakers',
        published: true,
        accessories: [
          { id: 601, name: "Echo Dot Stand", price: 15, image: '/images/speakers/accessories/EchoDotStand.jpg' }
        ]
      },
      {
        id: 24,
        name: "Google Nest Audio",
        price: 99,
        image: '/images/speakers/Google Nest Audio.jpg',
        description: 'High-quality smart speaker with Google Assistant. Rich sound, smart home control, and voice recognition.',
        category: 'Smart Speakers',
        published: true,
        accessories: [
          { id: 602, name: "Nest Audio Wall Mount", price: 25, image: '/images/speakers/accessories/NestAudioWallMount.jpg' }
        ]
      },
      {
        id: 25,
        name: "Apple HomePod Mini",
        price: 99,
        image: '/images/speakers/AppleHomePodMini.jpeg',
        description: 'Compact smart speaker with high-fidelity sound and Siri voice control. Integrates seamlessly with Apple devices.',
        category: 'Smart Speakers',
        published: true,
        accessories: [
          { id: 603, name: "HomePod Mini Sleeve", price: 20, image: '/images/speakers/accessories/HomePodMiniSleeve.jpg' }
        ]
      },
      {
        id: 26,
        name: "Sonos One",
        price: 199,
        image: '/images/speakers/SonosOne.jpeg',
        description: 'Smart speaker with voice control via Amazon Alexa or Google Assistant. High-quality sound and multi-room capability.',
        category: 'Smart Speakers',
        published: true,
        accessories: [
          { id: 604, name: "Sonos Wall Mount", price: 30, image: '/images/speakers/accessories/SonosWallMount.jpg' }
        ]
      },
      {
        id: 27,
        name: "Bose Home Speaker 500",
        price: 299,
        image: '/images/speakers/BoseSmartSpeaker.jpg',
        description: 'Smart speaker with excellent sound quality and built-in Alexa. Features a sleek design and easy connectivity.',
        category: 'Smart Speakers',
        published: true,
        accessories: []
      }
  ];
  
  // Continue adding more products for Smart Speakers, Smart Lightings, and Smart Thermostats
  });

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Function to add a new product
  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  // Function to update an existing product
  

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  // Function to remove a product by ID
  const removeProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  // Function to publish or unpublish a product
  const togglePublishProduct = (productId, published) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, published } : product
      )
    );
  };

  const addAccessoryToProduct = (productId, accessory) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          accessories: [...product.accessories, accessory]
        };
      }
      return product;
    }));
  };

  const updateAccessoryInProduct = (productId, updatedAccessory) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          accessories: product.accessories.map(accessory =>
            accessory.id === updatedAccessory.id ? updatedAccessory : accessory
          )
        };
      }
      return product;
    }));
  };

  const removeAccessoryFromProduct = (productId, accessoryId) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          accessories: product.accessories.filter(accessory => accessory.id !== accessoryId)
        };
      }
      return product;
    }));
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, removeProduct, togglePublishProduct, addAccessoryToProduct, updateAccessoryInProduct, removeAccessoryFromProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
