import React, { useContext } from 'react';
import { Icon, Header, ButtonGroup } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ConcealTextInput from '../components/ccxTextInput';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import Moment from 'moment';
import {
  maskAddress,
  getAspectRatio,
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

const Messages = () => {
  const { actions, state } = useContext(AppContext);
  const { setAppData } = actions;
  const { layout, messages, appData } = state;
  const filterButtons = ['All', 'Inbound', 'Outbound'];
  const { messagesLoaded } = layout;
  let isValidItem = false;
  let messageList = [];
  let counter = 0;

  Object.keys(messages).forEach(item => {
    messages[item].forEach(function (element) {
      isValidItem = true;
      counter++;

      // check if direction filter is set and the type of the message is appropriate
      if (((element.type == 'in') && (state.appData.messages.filterState == 2)) || ((element.type == 'out') && (state.appData.messages.filterState == 1))) {
        isValidItem = false;
      }

      // check if the text filter is set
      if (state.appData.messages.filterText && (element.message.toLowerCase().search(state.appData.messages.filterText.toLowerCase()) == -1)) {
        isValidItem = false;
      }

      if (isValidItem) {
        messageList.push({
          id: counter.toString(),
          address: item,
          message: element.message,
          timestamp: element.timestamp,
          type: element.type,
          sdm: element.sdm
        });
      }
    });
  });

  // sort the array by timestamp
  messageList.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return Moment(b.timestamp).toDate() - Moment(a.timestamp).toDate();
  });


  changeFilter = (selectedIndex) => {
    setAppData({
      messages: {
        filterState: selectedIndex
      }
    });
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Messages', style: AppStyles.appHeaderText }}
        rightComponent={messagesLoaded ?
          (< Icon
            onPress={() => NavigationService.navigate('SendMessage')}
            name='md-add-circle-outline'
            type='ionicon'
            color='white'
            size={32 * getAspectRatio()}
          />) : null}
      />
      <View style={styles.messagesWrapper}>
        <View>
          <ButtonGroup
            onPress={this.changeFilter}
            selectedIndex={state.appData.messages.filterState}
            buttons={filterButtons}
            buttonStyle={styles.filterButton}
            containerStyle={styles.filterButtons}
            innerBorderStyle={styles.filterButtonBorder}
            selectedButtonStyle={styles.filterButtonSelected}
          />
        </View>
        <ConcealTextInput
          placeholder='Enter text to search...'
          value={state.appData.messages.filterText}
          onChangeText={(text) => {
            setAppData({ messages: { filterText: text } });
          }}
          rightIcon={
            <Icon
              onPress={() => setAppData({ messages: { filterText: null } })}
              name='md-trash'
              type='ionicon'
              color='white'
              size={32 * getAspectRatio()}
            />
          }
        />

        {layout.userLoaded && messageList.length === 0
          ? (<View style={styles.emptyMessagesWrapper}>
            <Text style={styles.emptyMessagesText}>
              You have no messages currently. When someone will send you a message it will be visible here.
            </Text>
          </View>)
          : (<FlatList
            style={styles.flatList}
            data={messageList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <View style={(item.addr === appData.common.selectedWallet) ? [styles.flatview, styles.walletSelected] : styles.flatview}>
                <TouchableOpacity onPress={() => console.log("message")}>
                  <View>
                    <Text style={styles.address}>{maskAddress(item.address)}</Text>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.timestamp}>{Moment(item.timestamp).format('LLLL')}</Text>
                    <Text style={item.type == 'in' ? [styles.type, styles.typein] : [styles.type, styles.typeout]}>{item.type == 'in' ? "Inbound" : "Outbound"}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />)
        }
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  selectedWrapper: {
    position: 'absolute',
    right: 0,
    top: '15rem'
  },
  icon: {
    color: 'orange'
  },
  flatList: {
    height: '100%',
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderColor: AppColors.concealBorderColor,
    borderRadius: 10,
    marginBottom: '5rem',
    borderWidth: 1,
    marginTop: '5rem',
    padding: '20rem',
  },
  address: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  type: {
    fontSize: '14rem'
  },
  typein: {
    color: 'green',
  },
  typeout: {
    color: 'red',
  },
  message: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  timestamp: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  messagesWrapper: {
    flex: 1,
    padding: '10rem'
  },
  emptyMessagesWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyMessagesText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  msgDirection: {
    position: 'absolute',
    width: '32rem',
    height: '32rem',
    right: '10rem',
    top: '20rem',
  },
  filterButtons: {
    height: '45rem',
    borderColor: AppColors.concealBorderColor
  },
  filterButton: {
    borderColor: AppColors.concealOrange,
    backgroundColor: AppColors.concealBackground
  },
  filterButtonSelected: {
    borderColor: AppColors.concealOrange,
    backgroundColor: AppColors.concealOrange
  },
  filterButtonBorder: {
    color: AppColors.concealBorderColor
  }
});

export default Messages;
