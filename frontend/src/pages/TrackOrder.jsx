import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DelBoyTracking from "../components/DelBoyTracking";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const navigate=useNavigate();
  const [liveLocation, setLiveLocation] = useState({});
  const { socket } = useSelector((state) => state.user);
  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/get-order-byId/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(()=>{
    socket?.on("updateDeliveryLocation",({delBoyId, latitude, longitude})=>{
      setLiveLocation((prev)=>({
        ...prev,
        [delBoyId]:{
          lat:latitude,
          long:longitude
        }
      }));
    })
  },[socket])
  useEffect(() => {
    handleGetOrder();
  }, [orderId]);
  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        className="relative flex items-center gap-3 top-5 left-5 z-10 mb-3"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={35} className="text-orange-400" />
        <h1 className=" font-bold text-2xl md:text-center">Track Order</h1>
      </div>
      {currentOrder?.shopOrders?.map((shopOrder,index)=>(
        <div className="bg-amber-50 p-4 rounded-2xl shadow-md border border-orange-200 space-y-4" key={index}>
            <div>
                <p className="text-lg font-bold mb-2 text-orange-500">{shopOrder?.shop?.name}</p>
                <p ><span className="font-semibold">Items:</span> {shopOrder?.shopOrderItems?.map(i=>i.name).join(",")}</p>
                <p><span className="font-semibold">SubTotal:</span> {shopOrder.subTotal}</p>
                <p><span className="font-semibold">Delivery Address:</span> {currentOrder?.delAddress?.text}</p>
            </div>
            {shopOrder.status!="delivered"?<>
            {shopOrder.assignedDelBoy?
            <div className="text-sm text-gray-700">
                <p className="font-semibold"><span>Delivery Boy Name:</span> {shopOrder.assignedDelBoy.name}</p>
                <p className="font-semibold"><span>Delivery Boy Contact No:</span> {shopOrder.assignedDelBoy.mobile}</p>
            </div>:<p className="font-semibold">Delivery Boy is not Assigned yet.</p>
            }
            </>:
            <p className="font-bold text-center text-green-600 text-lg">Order Delivered</p>
            }
            {(shopOrder?.assignedDelBoy && shopOrder.status!="delivered") &&
            <div className="h-100 w-full rounded-2xl overflow-hidden shadow-md">
                <DelBoyTracking data={{
                    delBoyLocation:liveLocation[shopOrder.assignedDelBoy._id] ||
                    {
                        lat:shopOrder?.assignedDelBoy?.location?.coordinates[1],
                        long:shopOrder?.assignedDelBoy?.location?.coordinates[0],
                    },
                    customerLocation:{
                        lat:currentOrder?.delAddress?.latitude,
                        long:currentOrder?.delAddress?.longitude,
                    }
                }}/>
            </div>}
        </div>
      ))}
    </div>
  );
};

export default TrackOrder;
