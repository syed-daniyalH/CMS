// ** React Import
import { useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/core/components/option-menu'

// ** Type Import
import { Settings } from 'src/core/context/settingsContext'
import {useAuth} from "../../../../hooks/useAuth";

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()
  const { user } = useAuth();

  const handleLangItemClick = (lang: string) => {
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang)
  }

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    // i18n.init({
    //   lng: 'ar',
    //   fallbackLng: 'en',
    //   saveMissing: true,
    //   missingKeyHandler: function (lng, ns, key, fallbackValue) {
    //     let obj  = localStorage.getItem('missing_lang');
    //     let missing_lang = JSON.parse(obj??"{}");
    //     let objM = missing_lang[key] === key;
    //     if(!objM) {
    //       missing_lang[key] = key;
    //     }
    //     localStorage.setItem('missing_lang', JSON.stringify(missing_lang));
    //   }
    // });
    const language = localStorage.getItem("i18nextLng");
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon fontSize='1.525rem' icon='tabler:language' color={'#ffffff'} />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        ...((user?.languages??[]).map((element) => {
          return (
            {
              text: element.name,
              menuItemProps: {
                sx: { py: 2 },
                selected: i18n.language === element?.languageCode,
                onClick: () => {
                  handleLangItemClick(element?.languageCode??"en")
                  saveSettings({ ...settings, direction: (element?.languageCode ?? "").toLowerCase() === 'ar' || (element?.languageCode ?? "").toLowerCase() === 'ur' ? 'rtl' :'ltr' })
                }
              }
            }
          )
        }))
      ]}
    />
  )
}

export default LanguageDropdown
