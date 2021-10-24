import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { Header } from "../../components/Header";
import { MessageList } from "../../components/MessageList";
import { SignInBox } from "../../components/SignInBox";
import { SendMenssageForm } from "../../components/SendMenssageForm";
export function Home() {
   return (
      <View style={styles.container}>
         <Header />
         <MessageList />
         {/* <SignInBox /> */}
         <SendMenssageForm />
      </View>
   );
}
