import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppwriteContextProvider } from "./app/appwrite/AppwriteContext";
import Router from "./app/routes/Router";
import { ThemeProvider } from "./app/context/ThemeProvider";
import { LanguageContextProvider } from "./app/context/LocalizationContext";
import { AppLockProvider } from "./app/context/ScreenLockContext";
import { CurrencyProvider } from "./app/context/CurrencyProvider";
import { ShakeProvider } from "./app/context/ShakeContext";
import ShakesProvider1 from "./app/context/ShakeContext1";

export default function App() {
  return (
    <NavigationContainer>
      <AppLockProvider>
        <CurrencyProvider>
          <LanguageContextProvider>
            <ThemeProvider>
              <AppwriteContextProvider>
                <ShakeProvider>
                  <ShakesProvider1>
                  <Router />
                  </ShakesProvider1>
                </ShakeProvider>
              </AppwriteContextProvider>
            </ThemeProvider>
          </LanguageContextProvider>
        </CurrencyProvider>
      </AppLockProvider>
    </NavigationContainer>
  );
}
