import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4f46e5",
        tabBarButton: HapticTab,
        tabBarInactiveTintColor: "#94a3b8",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Estoque",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shippingbox.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Adicionar",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Relatórios",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.pie.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
