import React, { useContext } from 'react';
import { Icon, Header } from 'react-native-elements';
import { Alert, Text, View, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import { maskAddress } from '../helpers/utils';


const AddressBook = () => {
  const { actions, state } = useContext(AppContext);
  const { deleteContact } = actions;
  const { layout, user } = state;

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={26}
        />}
        centerComponent={{ text: 'Address Book', style: { color: '#fff', fontSize: 20 } }}
        rightComponent={<Icon
          onPress={() => console.log("pressed")}
          name='md-add-circle-outline'
          type='ionicon'
          color='white'
          size={26}
        />}
      />
      <View style={styles.walletsWrapper}>
        {layout.userLoaded && user.addressBook.length === 0
          ? <Text>
            You have no contacts saved in your address book.
            Add one by clicking on the button or when you are sending funds.
            </Text>
          : <FlatList
            data={user.addressBook}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.entryID.toString()}
            renderItem={({ item }) =>
              <View style={styles.flatview}>
                <View>
                  <Text style={styles.addressLabel}>{item.label}</Text>
                  <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                  {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                </View>
                <View style={styles.walletFooter}>
                  <Button
                    style={[styles.footerBtn, styles.footerBtnLeft]}
                    onPress={() => {
                      Alert.alert(
                        'Delete Contact',
                        'You are about to delete this contact! Do you really wish to proceed?',
                        [
                          { text: 'OK', onPress: () => deleteContact(item) },
                          { text: 'Cancel', style: 'cancel' },
                        ],
                        { cancelable: false },
                      );
                    }}
                  >
                    <Text style={styles.buttonText}>DELETE</Text>
                  </Button>
                  <Button style={[styles.footerBtn, styles.footerBtnRight]} onPress={() => { }}>
                    <Text style={styles.buttonText}>EDIT</Text>
                  </Button>
                </View>
              </View>
            }
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40'
  },
  buttonsWrapper: {
    position: 'absolute',
    right: 20
  },
  icon: {
    color: 'orange'
    //color: '#CCC'
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: 18
  },
  address: {
    color: '#FFA500'
  },
  data: {
    color: '#AAAAAA'
  },
  buttonContainer: {
    margin: 5
  },
  walletsWrapper: {
    top: 90,
    left: 10,
    right: 10,
    bottom: 0,
    position: 'absolute'
  },
  walletFooter: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1,
    height: 40,
    marginTop: 10,
    color: '#FFFFFF',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  },
  buttonText: {
    color: '#FFFFFF'
  }
});

export default AddressBook;