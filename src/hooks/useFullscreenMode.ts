import { useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import color from 'color';
import { useReaderSettings, useSettingsV1 } from '../redux/hooks';
import {
  changeNavigationBarColor,
  hideNavigationBar,
  showNavigationBar,
} from '../theme/NativeModules/NavigationBarColor';
import { readerBackground } from '../screens/reader/utils/readerStyles';
import { useTheme } from './useTheme';

const useFullscreenMode = () => {
  const { addListener } = useNavigation();
  const readerSettings = useReaderSettings();
  const { fullScreenMode } = useSettingsV1();

  const backgroundColor = readerBackground(readerSettings.theme);

  const theme = useTheme();

  const setImmersiveMode = useCallback(() => {
    if (fullScreenMode) {
      StatusBar.setHidden(true);
      hideNavigationBar();
    } else {
      StatusBar.setBarStyle(
        color(backgroundColor).isDark() ? 'light-content' : 'dark-content',
      );
      StatusBar.setBackgroundColor(backgroundColor);
      changeNavigationBarColor(backgroundColor as any);
    }
  }, [backgroundColor, fullScreenMode]);

  const showStatusAndNavBar = useCallback(() => {
    StatusBar.setHidden(false);
    showNavigationBar();
  }, []);

  useEffect(() => {
    setImmersiveMode();
  }, [setImmersiveMode]);

  useEffect(() => {
    const unsubscribe = addListener('beforeRemove', () => {
      showStatusAndNavBar();
      StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content');
    });

    return unsubscribe;
  }, []);

  return { setImmersiveMode, showStatusAndNavBar };
};

export default useFullscreenMode;
