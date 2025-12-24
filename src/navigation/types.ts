import { NavigatorScreenParams } from '@react-navigation/native';
import { RootStackParamList } from '../types';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

