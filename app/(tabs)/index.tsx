import { Redirect } from 'expo-router';

/** Default tab group route → OCC dashboard home (not legacy template). */
export default function TabsIndex() {
  return <Redirect href="/(tabs)/home" />;
}
