// eslint-disable-next-line import/prefer-default-export
export function getDefaultCountryName(lng: string, text: string) {
  if (lng == 'ru') {
    switch (text) {
      case 'Беларусь':
        return 'Belarus'
      case 'Польша':
        return 'Poland'
      case 'Украина':
        return 'Ukraine'
      case 'Россия':
        return 'Russia'
    }
  }
  if (lng == 'en') {
    return text
  }
}
