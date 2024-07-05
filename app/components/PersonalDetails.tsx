import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Modal, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RADIUS, SPACING } from "../theme";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import Button from "../components/Button";
import Typography from "../components/Typography";
import Input from "./TextInput";
import { useLanguage } from '../context/LocalizationContext';
import { StyleProps, useTheme } from "../context/ThemeProvider";

const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET_ID!;
const DELETE_TOKEN = process.env.EXPO_PUBLIC_CLOUD_DELETE_TOKEN_URL!;

const FILE_EXTENSION_REGEX = /\.(\w+)$/;

type ModalData = {
    field: keyof User | null;
    value: string;
};

type User = {
    id: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    deleteToken?: string; 
};

type Props = {
    userData: User;
    onUpdateProfile: (updatedProfile: Partial<User>) => void;
}

const PersonalDetails = ({ userData, onUpdateProfile }: Props) => {
    const { colors } = useTheme();
    const styles = getStyles({ colors });

    const [modalData, setModalData] = useState<ModalData>({ field: null, value: "" });
    const [user, setUser] = useState<User>({ ...userData });
    const [modalVisible, setModalVisible] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(userData.avatar || null); 
    const [isUploading, setIsUploading] = useState(false); 

    useEffect(() => {
        setUser({ ...userData });
    }, [userData]);

    const handleEditProfile = (field: keyof User) => {
        if (field === "avatar") {
            setModalData({ field: "avatar", value: "" });
            setModalVisible(true);
        } else {
            setModalData({ field, value: user[field] as string });
            setModalVisible(true);
        }
    };

    const handleSaveChanges = () => {
        if (modalData.field !== null) {
            setUser((prevUser) => ({
                ...prevUser,
                [modalData.field!]: modalData.value,
            }));

            onUpdateProfile({ [modalData.field!]: modalData.value });
        }
        setModalData({ field: null, value: "" });
        setModalVisible(false);
    };

    const selectAvatar = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission denied', 'You need to grant access to your photo library');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                handleImagePicked(result);
            } else {
                Alert.alert('Image selection canceled');
            }
        } catch (error) {
            console.error('Image selection error:', error);
            Alert.alert('Image selection failed', 'An error occurred while selecting your image');
        }
    };

    const handleImagePicked = async (pickerResult: ImagePicker.ImagePickerResult) => {
        if (isUploading) return; 
        setIsUploading(true);

        try {
            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                const localUri = pickerResult.assets[0].uri;
                const filename = localUri.split('/').pop() || 'test.jpg';
                const match = FILE_EXTENSION_REGEX.exec(filename);
                const type = match ? `image/${match[1]}` : 'image';

                const file = {
                    uri: localUri,
                    type: type,
                    name: filename,
                } as any;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', UPLOAD_PRESET);

                if (user.deleteToken) {
                    await deleteOldAvatar(user.deleteToken);
                }

                const response = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                setAvatar(data.secure_url);
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: data.secure_url,
                    deleteToken: data.delete_token,
                }));
                
                onUpdateProfile({ avatar: data.secure_url, deleteToken: data.delete_token });
                console.log("avatar:",data.secure_url)
            } else {
                Alert.alert('Image selection canceled');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            Alert.alert('Image upload failed', 'An error occurred while uploading your image');
        } finally {
            setIsUploading(false);
        }
    };

    const deleteOldAvatar = async (deleteToken: string) => {
        try {
            const response = await fetch(DELETE_TOKEN, {
                method: 'POST',
                body: JSON.stringify({ token: deleteToken }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete old avatar');
            }
        } catch (error) {
            console.error('Error deleting old avatar:', error);
            Alert.alert('Failed to delete old avatar', 'An error occurred while deleting your old avatar');
        }
    };

    const { translate } = useLanguage();

    return (
        <View>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => handleEditProfile("avatar")}>
                    {user.avatar ? (
                        <Image
                            source={{ uri: user.avatar }}
                            style={styles.avatar}
                        />
                    ) : (
                        <MaterialIcons
                            name="account-circle"
                            size={80}
                            color={colors.primary100}
                        />
                    )}
                    <View style={styles.editImageOption}>
                        <MaterialIcons name="mode-edit" size={16} color={colors.icon} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
                <Typography variant={"title03"}>{translate('personal_details')}</Typography>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.name}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("name")} style={styles.editOption} />
                </View>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.email}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("email")} style={styles.editOption} />
                </View>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.phoneNumber}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("phoneNumber")} style={styles.editOption} />
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalContainer}>
                    <TouchableOpacity
                        onPress={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <View style={styles.modalContent}>
                            <Typography variant="title02" style={styles.modalTitleStyle}>
                                Edit {modalData.field}
                            </Typography>
                            {modalData.field === "avatar" ? (
                                <TouchableOpacity
                                onPress={selectAvatar}
                                style={[
                                    styles.selectFromLibraryButton,
                                    isUploading && styles.selectFromLibraryButtonDisabled
                                ]}
                                disabled={isUploading}
                            >
                                <Typography variant={"title03"}>{translate('select_from_library')}</Typography>
                            </TouchableOpacity>
                            ) : (
                                <Input
                                    style={styles.modalInput}
                                    value={modalData.value}
                                    onChangeText={(text) =>
                                        setModalData({ ...modalData, value: text })
                                    }
                                    autoFocus={true}
                                    keyboardType="default"
                                />
                            )}
                            <Button onPress={handleSaveChanges}>{translate('save')}</Button>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <AntDesign name="closecircle" size={35} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
    profileContainer: {
        alignItems: "center",
        marginBottom: SPACING.spacing02
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: RADIUS.full,
        marginRight: SPACING.spacing03,
    },
    userInfo: {
        gap: SPACING.spacing02,
    },
    userInfoFields: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingLeft: SPACING.spacing01
    },
    editOption: {
        paddingHorizontal: SPACING.spacing02,
        color: colors.icon
    },
    editImageOption: {
        position: "absolute",
        right: SPACING.spacing01,
        bottom: SPACING.spacing01,
        borderWidth: 2,
        padding: SPACING.spacing01,
        backgroundColor: colors.primary,
        borderColor: colors.white,
        borderRadius: RADIUS.full,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: colors.transparentBlack,
    },
    modalContent: {
        backgroundColor: colors.card,
        padding: SPACING.spacing03,
        paddingTop: SPACING.spacing04,
        borderTopRightRadius: SPACING.spacing04,
        borderTopLeftRadius: SPACING.spacing04,
        gap: SPACING.spacing03,
    },
    modalTitleStyle: {
        fontWeight: "800",
    },
    modalInput: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        fontSize: 16,
        borderRadius: RADIUS.small,
        paddingHorizontal: SPACING.spacing02,
    },
    closeButton: {
        position: "absolute",
        top: -50,
        right: 10,
    },
    divider: {
        marginVertical: SPACING.spacing02,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        width: "85%",
        alignSelf: 'flex-end',
        marginRight: SPACING.spacing02,
    },
    selectFromLibraryButton: {
        backgroundColor: colors.gray100,
        paddingVertical: SPACING.spacing02,
        paddingHorizontal: SPACING.spacing03,
        borderRadius: RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.spacing02,
    },
    selectFromLibraryButtonDisabled: {
        opacity: 0.5,
    },
});

export default PersonalDetails;
