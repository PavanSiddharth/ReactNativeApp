import React, { Component } from 'react';
import { View, Text ,FlatList } from 'react-native';
import { ListItem , Tile } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { NavigationActions } from 'react-navigation'
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes
    }
  }

class Menu extends Component{

    constructor(props)
    {
        super(props);
        console.log(this.props)
    }

    static navigationOptions = {
        title: 'Menu'
    };

    render()
{

    const renderMenuItem = ({item, index}) => {
        console.log(this.props)
        return (
            <Animatable.View animation="fadeInRightBig" duration={2000}>
                <Tile
                key={index}
                title={item.name}
                caption={item.description}
                featured
                onPress={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'Dishdetail' }, { dishId: item.id }))}
                imageSrc={{ uri: baseUrl + item.image}}
                />
            </Animatable.View>
        );
    };

    if (this.props.dishes.isLoading) {
        return(
            <Loading />
        );
    }
    else if (this.props.dishes.errMess) {
        return(
            <View>            
                <Text>{props.dishes.errMess}</Text>
            </View>            
        );
    }
    else {
    return (
        
        <FlatList 
        data={this.props.dishes.dishes}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
        />
    );
    }
}}


export default connect(mapStateToProps)(Menu);