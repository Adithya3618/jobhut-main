import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

function serializeJob(job) {
  if (!job) return null;
  return {
    ...job,
    _id: job._id.toString(),
    datePosted: job.datePosted ? new Date(job.datePosted).toISOString() : null,
    lastDate: job.lastDate ? new Date(job.lastDate).toISOString() : null,
    expirationDate: job.expirationDate ? new Date(job.expirationDate).toISOString() : null,
  };
}

export async function getRecentJobs(limit = 9) {
  try {
    console.log('Attempting to connect to the database...');
    const client = await clientPromise;
    console.log('Connected to the database successfully');
    const db = client.db('jobhut');
    console.log('Fetching recent jobs...');
    const jobs = await db.collection('jobs')
      .find()
      .sort({ datePosted: -1 })
      .limit(limit)
      .toArray();
    console.log(`Fetched ${jobs.length} recent jobs`);
    return jobs.map(serializeJob);
  } catch (error) {
    console.error('Error in getRecentJobs:', error);
    return [];
  }
}

export async function getAllJobs() {
  try {
    const client = await clientPromise;
    const db = client.db('jobhut');
    const jobs = await db.collection('jobs')
      .find()
      .sort({ datePosted: -1 })
      .toArray();
    return jobs.map(serializeJob);
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    return [];
  }
}

export async function getJobById(id) {
  try {
    const client = await clientPromise;
    const db = client.db('jobhut');
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(id) });
    return serializeJob(job);
  } catch (error) {
    console.error('Error in getJobById:', error);
    return null;
  }
}

export async function searchJobs(params = {}) {
  try {
    const client = await clientPromise;
    const db = client.db('jobhut');
    const query = {};

    if (params.category) query.category = params.category;

    if (params.keyword) {
      query.$or = [
        { title: { $regex: params.keyword, $options: 'i' } },
        { companyName: { $regex: params.keyword, $options: 'i' } },
        { subCategory: { $regex: params.keyword, $options: 'i' } },
        { overview: { $regex: params.keyword, $options: 'i' } },
      ];
    }

    if (params.jobType) query.jobType = params.jobType;
    if (params.location) query.location = { $regex: params.location, $options: 'i' };
    if (params.salary) query.salary = { $regex: params.salary, $options: 'i' };
    if (params.experience) query.experience = { $regex: params.experience, $options: 'i' };
    if (params.qualification) query.qualification = { $regex: params.qualification, $options: 'i' };

    console.log('Search query:', query);

    const jobs = await db.collection('jobs')
      .find(query)
      .sort({ datePosted: -1 })
      .toArray();
    return jobs.map(serializeJob);
  } catch (error) {
    console.error('Error in searchJobs:', error);
    return [];
  }
}

export async function getSimilarJobs(subCategory, limit = 9) {
  try {
    const client = await clientPromise;
    const db = client.db('jobhut');
    const jobs = await db
      .collection('jobs')
      .find({ subCategory })
      .sort({ datePosted: -1 })
      .limit(limit)
      .toArray();
    return jobs.map(serializeJob);
  } catch (error) {
    console.error('Error in getSimilarJobs:', error);
    return [];
  }
}

