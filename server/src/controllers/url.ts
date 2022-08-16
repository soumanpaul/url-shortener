import { Request, Response } from 'express';
import * as shortid from 'shortid';
import errorHandler from '../helpers/errorHandler';
import responseHandler from '../helpers/responseHandler';
import Model from '../models/url';

export const create = async (req: Request, res: Response) => {
  const { body: { url: orginalUrl } } = req;
  const shortenId = shortid.generate();
  try {
    const url = new Model({ orginalUrl, shortenId });
    await url.save();

    let data = {
      url: `${process.env.SHORTEN_BASE_URL}/${url.shortenId}`,
      view: url.viewCount
    }

    responseHandler(res, { url: Array(data) })
  } catch (err) {
    errorHandler(res, err);
  }
};

export const read = async (req: Request, res: Response) => {
  const { params: { id: shortenId } } = req;
  try {
    const url = await Model.findOne({ shortenId });
    if (!url) {
      throw new Error('URL Not Found');
    }
    await Model.findOneAndUpdate({ shortenId }, { viewCount: url.viewCount + 1 })
    res.status(302).redirect(url.orginalUrl)
  } catch (err) {
    errorHandler(res, err);
  }
};

export const fetchUtls = async (req: Request, res: Response) => {
  try {
    let rl = req
    if (!rl) console.log("we")
    const urls = await Model.find({});
    if (!urls) {
      throw new Error('URL Not Found');
    }

    let shortUlrs = urls.map((url) => {
      let item = {
        url: `${process.env.SHORTEN_BASE_URL}/${url.shortenId}`,
        view: url.viewCount
      }
      return item
    })

    res.status(200).send({ url: shortUlrs })
  } catch (err) {
    errorHandler(res, err);
  }
};