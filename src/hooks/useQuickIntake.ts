import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useTasks } from './useTasks';

export function useQuickIntake() {
  const url = Linking.useURL();
  const { submitBrainDump } = useTasks();

  useEffect(() => {
    if (url) {
      const { path, queryParams } = Linking.parse(url);
      
      if (path === 'dump' && queryParams?.text) {
        // Automatically submit the text from the widget/intent
        const text = decodeURIComponent(queryParams.text as string);
        submitBrainDump(text).catch((err) => {
          console.error('Quick intake failed:', err);
        });
      }
    }
  }, [url, submitBrainDump]);
}
