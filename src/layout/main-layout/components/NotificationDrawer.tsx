/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Drawer,
  DrawerContent,
  DrawerContentArea,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CustomDialogTitle from "@/components/common/CustomDialogTitle";
import NotificationCard from "./NotificationCard";
import { Button } from "@/components/ui/button";
// import DialogFooterWrapper from "@/components/common/DialogFooterWrapper";
// import { Button } from "@/components/ui/button";
// import { Loader, SendHorizontal, X } from "lucide-react";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  handleDismiss: () => void;
  handleReadNotifications: (id: number) => void;
  // formik: any;
  notificationData: any[];
  // isSubmitting: boolean;
}

const NotificationDrawer = (props: NotificationDrawerProps) => {
  const {
    open,
    onClose,
    handleDismiss,
    notificationData,
    handleReadNotifications,
  } = props;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <CustomDialogTitle title="Notifications" handleClose={onClose} />
          </DrawerTitle>
        </DrawerHeader>

        <DrawerContentArea
          className="px-4"
          style={{ backgroundColor: "#f6f8fb" }}
        >
          {notificationData?.length > 0 ? (
            <>
              <div className="w-full flex justify-end mt-2 mb-1.25">
                <Button
                  variant={"ghost"}
                  style={{ color: "blue", fontSize: "0.78rem" }}
                  onClick={() => handleDismiss()}
                >
                  Dismiss all
                </Button>
              </div>

              <div>
                {notificationData?.map((i) => (
                  <NotificationCard
                    key={i?.id}
                    data={i}
                    onClose={onClose}
                    handleReadNotifications={handleReadNotifications}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="my-40 text-center text-[#4B5563]">
              There are no notifications for now.
            </p>
          )}
        </DrawerContentArea>

        <DrawerFooter>
          {/* <DialogFooterWrapper>
            <Button
              variant="outline"
              color="primary"
              className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
              onClick={onClose}
            >
              <X />
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => formik.handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader />
                  Creating
                </>
              ) : (
                <>
                  <SendHorizontal />
                  Create
                </>
              )}
            </Button>
          </DialogFooterWrapper> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawer;
