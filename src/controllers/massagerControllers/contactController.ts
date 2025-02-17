import { NextFunction, Request, Response } from "express";
import { buildAggregationPipeline } from "../../helpers/Query/AggregationPipeline";
import User from "../../models/User";
import { PipelineStage } from "mongoose";
import { generatePaginationLinks } from "../../helpers/Query/GeneratePaginationLinks";
import { createResponse } from "../../helpers/Query/QueryResponse";
import { CustomError } from "../../helpers/CustomError";
import FriendRequest from "../../models/FriendRequest";
import yup from "yup";

const contactController = class {
  static get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, items_per_page, search, sort, order } = req.query;
      // Convert query params to the expected types
      const queryOptions = {
        page: Number(page) || 1,
        items_per_page: (Number(items_per_page) || 10) as 10 | 30 | 50 | 100,
        search: search as string,
        sort: sort as string,
        order: order as "asc" | "desc",
      };

      const contacts = await User.aggregate([
        { $match: { _id: req.user?._id } },
        // { $match: { _id: 14 } },
        {
          $lookup: {
            from: "users",
            localField: "contacts",
            foreignField: "_id",
            as: "contacts",
          },
        },
        {
          $lookup: {
            from: "uploads", // Collection name for profile pictures
            localField: "contacts.pic",
            foreignField: "_id",
            as: "contactsPics",
          },
        },
        {
          $addFields: {
            contacts: {
              $map: {
                input: "$contacts",
                as: "contact",
                in: {
                  _id: "$$contact._id",
                  name: "$$contact.name",
                  family: "$$contact.family",
                  full_name: "$$contact.full_name",
                  phone_number: "$$contact.phone_number",
                  pic: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$contactsPics",
                          as: "pic",
                          cond: { $eq: ["$$pic._id", "$$contact.pic"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },

        {
          $project: {
            "contacts._id": 1,
            "contacts.name": 1,
            "contacts.family": 1,
            "contacts.full_name": 1,
            "contacts.phone_number": 1,
            "contacts.pic.sizes": 1,
          },
        },
      ]);

      res.status(200).json(
        createResponse(contacts[0].contacts, {
          message: "Contacts retrieved successfully",
          // pagination,
        })
      );
      // // Define searchable fields
      // const searchableFields = ["name", "family", "full_name", "phone_number"]; // Adjust fields based on your schema

      // //   Define desire project fields

      // const selectFields: Record<string, 0 | 1> = {
      //   name: 1,
      //   family: 1,
      //   full_name: 1,
      //   pic: 1,
      //   phone_number: 1,
      // };
      // const populatableFields = [
      //   {
      //     path: "pic",
      //     from: "uploads",
      //     localField: "pic",
      //     foreignField: "_id",
      //   },
      // ];
      // // Build aggregation pipeline
      // const { pipeline, pagination } = buildAggregationPipeline(
      //   queryOptions,
      //   searchableFields,
      //   selectFields,
      //   populatableFields
      // );

      // // Execute the aggregation pipeline
      // const users = await User.aggregate(pipeline);
      // // Count total items
      // const matchStage = pipeline.find((stage) => "$match" in stage) as
      //   | PipelineStage.Match
      //   | undefined;
      // const totalItems = await User.countDocuments(matchStage?.$match || {});

      // // Update pagination state
      // pagination.links = generatePaginationLinks(
      //   totalItems,
      //   pagination.page,
      //   pagination.items_per_page
      // );

      // // Send response
      // res.status(200).json(
      //   createResponse(users, {
      //     message: "Contacts retrieved successfully",
      //     pagination,
      //   })
      // );
    } catch (error) {
      next(error);
    }
  };

  static addFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { recipientId } = req.body;
      const sender_id = req.user?._id;
      const recipientUser = await User.exists({ _id: recipientId });
      if (!recipientId) {
        throw new CustomError("User Not Found!", 400, {
          message: ["User Not Found!"],
        });
      }
      if (await FriendRequest.exists({ sender_id, receiver_id: recipientId })) {
        throw new CustomError("Friend Request already sent", 400, {
          message: ["Friend Request already sent"],
        });
      }
      await FriendRequest.create({
        sender_id,
        receiver_id: recipientUser?._id,
      });
      res.status(201).json(
        createResponse("", {
          message: "Friend request sent successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };

  static removeFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {}
  };

  static searchNewContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, items_per_page, search, sort, order } = req.query;
      const authUser = await User.findById(req?.user?._id).select("contacts");
      // Convert query params to the expected types
      const queryOptions = {
        page: Number(page) || 1,
        items_per_page: (Number(items_per_page) || 10) as 10 | 30 | 50 | 100,
        search: search as string,
        sort: sort as string,
        order: order as "asc" | "desc",
      };

      // Define searchable fields
      const searchableFields = ["name", "family", "full_name", "phone_number"]; // Adjust fields based on your schema

      //   Define desire project fields

      const selectFields: Record<string, 0 | 1> = {
        name: 1,
        family: 1,
        full_name: 1,
        pic: 1,
      };
      const populatableFields = [
        {
          path: "pic",
          from: "uploads",
          localField: "pic",
          foreignField: "_id",
        },
      ];
      // Build aggregation pipeline
      const { pipeline, pagination } = buildAggregationPipeline(
        queryOptions,
        searchableFields,
        selectFields,
        populatableFields
      );

      // Add computed field `is_contact`
      if (authUser && authUser!.contacts!.length > 0) {
        pipeline.push({
          $addFields: {
            is_friend: {
              $cond: {
                if: { $in: ["$_id", authUser?.contacts] },
                then: true,
                else: false,
              },
            },
          },
        });
      }

      // Lookup `FriendRequest` to check if a request is pending
      pipeline.push(
        {
          $lookup: {
            from: "friendrequests", // The collection name
            let: { searchedUserId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$sender_id", authUser?._id] }, // Sent by auth user
                      { $eq: ["$receiver_id", "$$searchedUserId"] }, // Sent to this user
                      { $eq: ["$status", "pending"] }, // Status is pending
                    ],
                  },
                },
              },
            ],
            as: "friend_request",
          },
        },
        {
          $addFields: {
            friend_request_sent: { $gt: [{ $size: "$friend_request" }, 0] },
          },
        },
        {
          $project: {
            friend_request: 0, // Remove extra lookup field
          },
        }
      );
      // Execute the aggregation pipeline
      const users = await User.aggregate(pipeline);
      // Count total items
      const matchStage = pipeline.find((stage) => "$match" in stage) as
        | PipelineStage.Match
        | undefined;
      const totalItems = await User.countDocuments(matchStage?.$match || {});

      // Update pagination state
      pagination.links = generatePaginationLinks(
        totalItems,
        pagination.page,
        pagination.items_per_page
      );

      // console.log(users);
      // Send response
      res.status(200).json(
        createResponse(users, {
          message: "Users retrieved successfully",
          pagination,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  static getFriendRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?._id;

      const friendRequests = await FriendRequest.aggregate([
        { $match: { receiver_id: req.user?._id } },
        // { $match: { _id: 14 } },
        {
          $lookup: {
            from: "users", // Collection name of the User model
            localField: "sender_id",
            foreignField: "_id",
            as: "sender",
          },
        },
        {
          $unwind: "$sender", // Convert array to an object since $lookup returns an array
        },
        {
          $lookup: {
            from: "uploads", // Collection name of the Uploads model
            localField: "sender.pic",
            foreignField: "_id",
            as: "sender.pic",
          },
        },
        {
          $unwind: {
            path: "$sender.pic",
            preserveNullAndEmptyArrays: true, // Allow null if no pic exists
          },
        },
        {
          $project: {
            "sender._id": 1,
            "sender.full_name": 1,
            "sender.phone_number": 1,
            "sender.pic.sizes": 1,
            status: 1,
            
          },
        },
      ]);
      // const friendRequests = await FriendRequest.find({
      //   receiver_id: userId,
      //   status: "pending",
      // }).populate('sender_id' , 'sender_id.pic');
      res.status(200).json(
        createResponse(friendRequests, {
          message: "Friend requests retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };
  static changeFriendRequestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // validation
      const body = yup.object().shape({
        _id: yup.number().required("id is required"),
        status: yup
          .string()
          .required("status is required")
          .oneOf(["accepted", "rejected"]),
      });
      await body.validate(req.body, {
        abortEarly: false,
      });

      const { _id, status } = req.body;
      const receiver_id = req.user?._id;

      const friendRequest = await FriendRequest.findById(_id);
      if (!friendRequest)
        throw new CustomError("Friend request not found", 400, {
          message: ["Friend request not found"],
        });
      if (friendRequest.receiver_id !== receiver_id)
        throw new CustomError("You don't have permissions", 400, {
          message: ["Permission denied"],
        });
      friendRequest.status = status;
    } catch (error) {
      next(error);
    }
  };
};

export default contactController;
