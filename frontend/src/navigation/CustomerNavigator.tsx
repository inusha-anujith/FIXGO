import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateRequestScreen } from "../features/customer/request/CreateRequestScreen";
import { PaymentScreen } from "../features/customer/request/PaymentScreen";
import type { CustomerStackParamList } from "./types";

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export function CustomerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CreateRequest" 
        component={CreateRequestScreen} 
        options={{ title: "Select Breakdown Location" }} 
      />
      {/* registering your new payment screen here */}
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: "Secure Checkout" }} 
      />
    </Stack.Navigator>
  );
}