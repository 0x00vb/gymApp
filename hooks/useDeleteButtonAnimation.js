import { useState, useRef } from 'react';
import { Animated } from 'react-native';

const useDeleteButtonAnimation = () => {
    const [longPressed, setLongPressed] = useState(null);
    const animationProgress = useRef(new Animated.Value(-71)).current;

    const showDeleteButton = (index) => {
        setLongPressed(index);
        Animated.timing(animationProgress, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    };

    const hideDeleteButton = () => {
        Animated.timing(animationProgress, { toValue: -70, duration: 300, useNativeDriver: false }).start(() => {
            setLongPressed(null);
        });
    };

    return { longPressed, setLongPressed, animationProgress, showDeleteButton, hideDeleteButton };
};

export default useDeleteButtonAnimation;
