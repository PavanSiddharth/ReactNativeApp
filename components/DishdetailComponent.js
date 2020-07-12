import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList , Modal , StyleSheet, Alert, PanResponder,Button, Share } from 'react-native';
import { COMMENTS } from '../shared/comments';
import { Card, Icon,Rating } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites

    }
  }

  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment))
})

 

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}> 
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>
    );
}


function RenderDish(props) {

    const dish = props.dish;

     handleViewRef = ref => view = ref;
const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if ( dx < -200 )
        return true;
    else
        return false;
}

const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if ( dx > 200 )
        return true;
    else
        return false;
}


const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
        return true;
    },

    onPanResponderGrant: () => {
        this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
    },

    onPanResponderEnd: (e, gestureState) => {
        console.log("pan responder end", gestureState);
        if (recognizeDrag(gestureState))
            Alert.alert(
                'Add Favorite',
                'Are you sure you wish to add ' + dish.name + ' to favorite?',
                [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                ],
                { cancelable: false }
            );

            if (recognizeComment(gestureState))
            props.onPress1()

        return true;
    }
})

const shareDish = (title, message, url) => {
    Share.share({
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
    },{
        dialogTitle: 'Share ' + title
    })
}
    
        if (dish != null) {
            return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
             {...panResponder.panHandlers} ref={this.handleViewRef}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                    raised
                    reverse
                    name='pencil'
                    type='font-awesome'
                    color='#512DA8'
                    onPress={() => props.onPress1()}
                    />
                    <Icon
                    raised
                    reverse
                    name='share'
                    type='font-awesome'
                    color='#51D2A8'
                    style={styles.cardItem}
                    onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            showModal : false,
            rating : 0,
            author : '',
            comment : ''
        };
    }


    ratingCompleted(rating)
    {
        this.setState({rating:rating})
    }

    onChangeText1(text)
    {
        this.setState({author:text})
    }

    onChangeText2(text)
    {
        this.setState({comment:text})
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(dishId) {
       this.props.postComment(dishId , this.state.rating,this.state.author,this.state.comment)
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    onPress1={() => this.toggleModal()} 
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                visible = {this.state.showModal}
                onDismiss = {() => this.toggleModal() }
                onRequestClose = {() => this.toggleModal() }
               >
                <View style = {styles.modal}>
                    <Rating
                    showRating
                    onFinishRating={this.ratingCompleted}
                    style={{ paddingVertical: 10 }}
                    />
                    <Input
                    placeholder='Author'
                    onChangeText={text => onChangeText1(text)}
                    leftIcon={
                      <Icon
                        name='user'
                        size={24}
                        color='black'
                      />
                    }
                  />
                  <Input
                  placeholder='Comment'
                  onChangeText={text => onChangeText2(text)}
                  leftIcon={
                    <Icon
                      name='comment'
                      size={24}
                      color='black'
                    />
                  }
                />

                <Button 
                        onPress = {() =>this.handleComment(dishId)}
                        color="#512DA8"
                        title="Submit" 
                        />
                    
                    <Button 
                        onPress = {() =>this.toggleModal()}
                        color="#512DA8"
                        title="Cancel" 
                        />
                </View>
            </Modal>
             </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     }
});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);