import React from "react";

import { View } from "react-native";
import { COLORS } from "../../theme";
import { Button } from "../Button";
import { useAuth } from "../../hooks/auth";
import { styles } from "./styles";

export function SignInBox() {
   const { signIn, isSigningIn } = useAuth();
   return (
      <View>
         <Button
            title='Entrar com Github'
            color={COLORS.BLACK_PRIMARY}
            backgroundColor={COLORS.YELLOW}
            icon='github'
            onPress={signIn}
            isLoading={isSigningIn}
         />
      </View>
   );
}
