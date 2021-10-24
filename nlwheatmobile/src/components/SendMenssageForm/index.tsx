import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { COLORS } from "../../theme";
import { Button } from "../Button";
import { styles } from "./styles";

export function SendMenssageForm() {
   const [message, setMessage] = useState("");
   const [sendingMessage, setSendingMessage] = useState(false);

   return (
      <View style={styles.container}>
         <TextInput
            style={styles.input}
            keyboardAppearance='dark'
            placeholder='Qual sua expectativa para o evento'
            placeholderTextColor={COLORS.GRAY_PRIMARY}
            multiline
            onChangeText={setMessage}
            value={message}
            maxLength={140}
            editable={!sendingMessage}
         />

         <Button
            title='ENVIAR MENSAGEM'
            backgroundColor={COLORS.PINK}
            color={COLORS.WHITE}
         />
      </View>
   );
}
