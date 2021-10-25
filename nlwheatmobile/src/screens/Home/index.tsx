import React from "react";
import { KeyboardAvoidingView, View, Platform } from "react-native";
import { styles } from "./styles";
import { Header } from "../../components/Header";
import { MessageList } from "../../components/MessageList";
import { SignInBox } from "../../components/SignInBox";
import { SendMenssageForm } from "../../components/SendMenssageForm";
import { useAuth } from "../../hooks/auth";

export function Home() {
   const { user } = useAuth();
   return (
      <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === "ios" ? "padding" : undefined}>
         <View style={styles.container}>
            <Header />
            <MessageList />
            {user ? <SendMenssageForm /> : <SignInBox />}
         </View>
      </KeyboardAvoidingView>
   );
}
