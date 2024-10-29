import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../constants/colors';
import withReduxStore from '../../utils/withReduxStore';
import EventEmitter from '../../utils/EventEmmiter';

import { vh } from 'react-native-expo-viewport-units';

function TabBar({
  state,
  descriptors,
  navigation,
  tabBarVisible,
  updateUser,
}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  //console.log(focusedOptions);
  if (focusedOptions.tabBarVisible === false || tabBarVisible === false) {
    return null;
  }

  return (
    <View
      name="tab123"
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: 1,
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {

          updateUser({ selectedTab: route.name });
          EventEmitter.dispatch('tabPressed', {tabName:route.name});
          if (route.name !== 'Side effects') {
            updateUser({ sideEffectsScenario: null });
          } else updateUser({ sideEffectsScenario: '@CheckSideEffects' });
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName;
        let iconType;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            iconType = 'Icon';
            break;
          case 'Side effects':
            iconName = 'clipboard-notes';
            iconType = 'Foundation';
            break;
          case 'Appointments':
            iconName = 'calendar-sharp';
            iconType = 'Ionicons';
            break;
          case 'Profile':
            iconName = 'account-circle-outline';
            break;
        }

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, marginTop: vh(0.7), marginTop: vh(1) }}>
            <View style={{ alignSelf: 'center' }}>
              {iconType === 'Icon' ? (
                <Icon
                  size={40}
                  name={iconName}
                  color={isFocused ? colors.blue : colors.unselected}
                />
              ) : iconType === 'Foundation' ? (
                <Foundation
                  size={37}
                  name={iconName}
                  color={isFocused ? colors.blue : colors.unselected}
                />
              ) : iconType === 'Ionicons' ? (
                <Ionicons
                  size={36}
                  name={iconName}
                  color={isFocused ? colors.blue : colors.unselected}
                />
              ) : (
                      <Material
                        size={43}
                        name={iconName}
                        color={isFocused ? colors.blue : colors.unselected}
                      />
                    )}
            </View>
            <View style={{ alignSelf: 'center' }}>
              <Text
                style={{
                  color: isFocused ? colors.blue : colors.unselected,
                  fontSize: 12,
                }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default withReduxStore(TabBar);
