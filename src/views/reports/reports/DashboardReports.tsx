// ** React Imports
import React, {useContext, useEffect, useState} from "react";

// ** Axios Imports
import axios from "axios";


// ** MUI Imports
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// ** Custom Component Imports
import SalesReports from "./component/SalesReports";
import ConfirmationDialog from 'src/@core/utils/ConfirmationDialog'
import {AbilityContext} from "src/layouts/components/acl/Can";
import CustomerReports from './component/CustomerReports'


interface FavouriteType {
  recno: number,
  itemName: string,
  itemUrl: string,
  itemIcon: string
}

const DashboardReports = () => {

  // ** Local Storage

  // ** State
  const [favourite, setFavourite] = useState<FavouriteType[]>([])
  const [dialog, setDialog] = useState<any>({show: false, title: '', subtitle: ''})
  const ability = useContext(AbilityContext)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/UserFavourites/GetFavouritesList');

      const favouriteArray = response?.data?.data?.list ?? [];

      const updateFavArray = favouriteArray.filter((favItem: any) => ability.can('view', favItem.screenDescription))

      setFavourite(updateFavArray);
    } catch (error) {
      // Handle any error that might occur during the request
      console.error('Error fetching data:', error);
    }
  };

  const checkFav = (url: any) => {
    let exist = false;
    for (let i = 0; i < favourite.length; i++) {
      const indexOfQuestionMark = url.indexOf('?');

      const urlBeforeQuestionMark = indexOfQuestionMark !== -1 ? url.substring(0, indexOfQuestionMark) : url;

      if (favourite[i].itemUrl === urlBeforeQuestionMark) {
        exist = true;
        break;
      }
    }
    return exist;
  };

  const makeReportFav = async (title: any, url: any, iconName: any, screenDescription: any) => {
    const indexOfQuestionMark = url.indexOf('?');

    const urlBeforeQuestionMark = indexOfQuestionMark !== -1 ? url.substring(0, indexOfQuestionMark) : url;

    let data = {
      itemName: title,
      itemUrl: urlBeforeQuestionMark,
      itemIcon: iconName,
      screenDescription: screenDescription,
    };
    let res;
    let favItem;
    let exist = false;
    for (let i = 0; i < favourite.length; i++) {
      if (favourite[i].itemUrl === urlBeforeQuestionMark) {
        favItem = favourite[i];
        exist = true;
        break;
      }
    }

    if (favItem) {
      res = await axios.delete("/UserFavourites/RemoveFavourites/" + favItem.recno);

      setDialog({
        show: true,
        title: 'Removed Successfully',
        subtitle: favItem?.itemName + ' removed from favorite successfully' ?? ''
      })
    } else {
      res = await axios.post('/UserFavourites/AddFavourites', data, );

      setDialog({
        show: true,
        title: 'Favourite Successfully',
        subtitle: data?.itemName + ' added to favorite successfully' ?? ''
      })
    }
    if (res.data?.isSuccessFull) {
      fetchData()
    } else {
      setDialog({show: true, title: '', subtitle: res?.data ?? ''})
    }
  };

  return (
    <div>
      <Box sx={{px: 3}}>
        <Grid container spacing={3}>
          <Grid item md={3}>

            <SalesReports makeReportFav={makeReportFav} checkFav={checkFav}/>


          </Grid>

          {/*<Grid item md={3}>*/}
          {/*  <CustomerReports makeReportFav={makeReportFav} checkFav={checkFav}/>*/}
          {/*</Grid>*/}

        </Grid>
      </Box>

      <ConfirmationDialog dialog={dialog} setDialog={setDialog}/>
    </div>
  )
};

export default DashboardReports;
