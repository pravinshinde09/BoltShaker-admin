import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from 'react-native';
import OffersCard from '../../components/OffersCard';
import { StyleProps, useTheme } from '../../context/ThemeProvider';
import { databases, APPWRITE_DATABASE_ID, OFFERS_COLLECTION_ID } from "../../appwrite/appWriteConfig";
import { Models } from 'appwrite';
import { useLanguage } from "../../context/LocalizationContext";
import Typography from "../../components/Typography";

const OffersScreen = () => {
  const { colors } = useTheme();
  const style = getStyle({ colors });
  const [data, setData] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();
  const [itemData, setItemData] = useState<{ offers: any[] } | null>(null);

  useEffect(() => {
    // Fetch the list of offer JSON file URLs from the AppWrite database.
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments<Models.Document>(APPWRITE_DATABASE_ID, OFFERS_COLLECTION_ID);
        setData(response.documents);
      } catch (error) {
        console.error("Database error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch the actual offer data from the URL provided in the database for the current locale.
    const fetchItemData = async () => {
      if (data.length > 0 && locale) {
        try {
          setIsLoading(true);
          const fetchedData = await fetch(data[0][locale]).then(response => response.json());
          console.log("fetchedData", fetchedData);
          setItemData(fetchedData);
        } catch (error) {
          console.error("Fetch item data error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchItemData();
  }, [data, locale]);

  return (
    <ScrollView>
      <View style={style.container}>
        {isLoading ? (
          <Typography variant="title03">Loading data...</Typography>
        ) : (
          itemData && itemData.offers ? (
            <OffersCard OffersData={itemData.offers} />
          ) : (
            <Typography variant="title03">No offers available.</Typography>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default OffersScreen;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    backgroundColor: colors.background
  }
});
