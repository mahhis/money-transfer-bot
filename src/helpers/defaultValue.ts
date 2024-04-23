export function getDefaultCountryName(lng: string, text: string) {
   
    if(lng == 'ru'){
        switch (text) {
            case 'Беларусь':
                return 'Belarus'
            case 'Польша':
                return 'Poland'   
        } 
    } 
    if(lng == 'en'){
        return text  
    }
  }