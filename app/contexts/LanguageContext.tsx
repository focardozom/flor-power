'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    title: "Flower Power",
    description: "Between November 2020 and December 2024, 533 cannabis samples were analyzed in Colombia to assess their potency using near-infrared spectrometry. These samples were collected from 15 different locations across the country, including Antioquia, Bogotá, Santander, Valle del Cauca, Cauca, Bolivar, Cundinamarca, Caldas, Norte de Santander, Magdalena, and Huila. This analysis included flowers and extracts from licensed projects, home growers, and cannabis competitions. With these data, we aim to contribute to an informed debate on cannabis regulation and responsible consumption.",
    
    // Cards
    averageThc: "Average THC",
    averageThcDesc: "Average THC content in cannabis samples.",
    thcAwareness: "THC Potency Awareness",
    thcAwarenessDesc: "More THC doesn't always mean a better experience. Cannabis with high THC levels can increase the risk of adverse effects.",
    typicalThcRange: "Typical THC Range",
    typicalThcRangeDesc: "Half of all samples fell within this THC range, representing the most common potency levels found.",
    averageCbd: "Average CBD",
    averageCbdDesc: "Average CBD content in samples",
    highestCbd: "Highest CBD",
    highestCbdDesc: "Maximum CBD level recorded in a sample",
    thcCbdRelationship: "The THC-CBD Relationship",
    thcCbdRelationshipDesc: "When THC levels go up, CBD levels tend to go down. This relationship is strongest in cannabis with less than 10% THC.",
    highestThc: "Highest THC",
    highestThcDesc: "Highest THC level recorded in a sample",
    historicalContext: "Historical Context",
    historicalContextDesc: "Cannabis potency has changed. Decades ago, 10% THC was considered strong. Today, some strains exceed 30%, posing new challenges for informed consumption.",
    colombianUsage: "Colombian Usage",
    colombianUsageDesc: "Proportion of Colombians who have consumed cannabis",
    marketEducation: "Market Education",
    marketEducationDesc: "A more informed market is a safer market. Accessing reliable information about cannabinoids in cannabis products is key to reducing risks and improving the consumer experience.",
    
    // Subscription
    getReport: "Get the Complete Report",
    getReportDesc: "Leave your email to receive a comprehensive analysis of cannabis potency in Colombia.",
    emailPlaceholder: "Your email",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
    
    // Form validation
    invalidEmail: "Please enter a valid email address",
    errorOccurred: "An error occurred. Please try again.",
    
    // Footer
    createdBy: "Created by figura01",
    
    // Language switcher
    language: "Language",
    english: "English",
    spanish: "Español",
    
    // THC Range card - missing translations
    toConnector: "to"
  },
  es: {
    // Header
    title: "Flower Power",
    description: "Entre noviembre de 2020 y diciembre de 2024, se analizaron 533 muestras de cannabis en Colombia para evaluar su potencia usando espectrometría de infrarrojo cercano. Estas muestras fueron recolectadas de 15 ubicaciones diferentes en el país, incluyendo Antioquia, Bogotá, Santander, Valle del Cauca, Cauca, Bolívar, Cundinamarca, Caldas, Norte de Santander, Magdalena y Huila. Este análisis incluyó flores y extractos de proyectos licenciados, cultivadores caseros y competencias de cannabis. Con estos datos, buscamos contribuir a un debate informado sobre la regulación del cannabis y el consumo responsable.",
    
    // Cards
    averageThc: "THC Promedio",
    averageThcDesc: "Contenido promedio de THC en las muestras de cannabis.",
    thcAwareness: "Conciencia sobre la Potencia del THC",
    thcAwarenessDesc: "Más THC no siempre significa una mejor experiencia. El cannabis con altos niveles de THC puede aumentar el riesgo de efectos adversos.",
    typicalThcRange: "Rango Típico de THC",
    typicalThcRangeDesc: "La mitad de todas las muestras se encontraron dentro de este rango de THC, representando los niveles de potencia más comunes encontrados.",
    averageCbd: "CBD Promedio",
    averageCbdDesc: "Contenido promedio de CBD en las muestras",
    highestCbd: "CBD Más Alto",
    highestCbdDesc: "Nivel máximo de CBD registrado en una muestra",
    thcCbdRelationship: "La Relación THC-CBD",
    thcCbdRelationshipDesc: "Cuando los niveles de THC suben, los niveles de CBD tienden a bajar. Esta relación es más fuerte en cannabis con menos del 10% de THC.",
    highestThc: "THC Más Alto",
    highestThcDesc: "Nivel más alto de THC registrado en una muestra",
    historicalContext: "Contexto Histórico",
    historicalContextDesc: "La potencia del cannabis ha cambiado. Hace décadas, el 10% de THC se consideraba fuerte. Hoy, algunas variedades superan el 30%, planteando nuevos desafíos para el consumo informado.",
    colombianUsage: "Uso en Colombia",
    colombianUsageDesc: "Proporción de colombianos que han consumido cannabis",
    marketEducation: "Educación del Mercado",
    marketEducationDesc: "Un mercado más informado es un mercado más seguro. Acceder a información confiable sobre cannabinoides en productos de cannabis es clave para reducir riesgos y mejorar la experiencia del consumidor.",
    
    // Subscription
    getReport: "Obtén el Reporte Completo",
    getReportDesc: "Deja tu email para recibir un análisis completo de la potencia del cannabis en Colombia.",
    emailPlaceholder: "Tu email",
    subscribe: "Suscribirse",
    subscribing: "Suscribiendo...",
    
    // Form validation
    invalidEmail: "Por favor ingresa una dirección de email válida",
    errorOccurred: "Ocurrió un error. Por favor intenta de nuevo.",
    
    // Footer
    createdBy: "Creado por figura01",
    
    // Language switcher
    language: "Idioma",
    english: "English",
    spanish: "Español",
    
    // THC Range card - missing translations
    toConnector: "a"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es'); // Default to Spanish since it's for Colombia

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
