import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Linking, Platform, Pressable, type PressableProps } from 'react-native';

type ExternalLinkProps = PressableProps & {
  href: string;
  children: React.ReactNode;
};

export function ExternalLink({ href, onPress, children, ...props }: ExternalLinkProps) {
  return (
    <Pressable
      {...props}
      onPress={async (event) => {
        onPress?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (Platform.OS === 'web') {
          window.open(href, '_blank', 'noopener,noreferrer');
          return;
        }

        const result = await WebBrowser.openBrowserAsync(href);
        if (result.type === 'cancel') {
          await Linking.openURL(href);
        }
      }}>
      {children}
    </Pressable>
  );
}
