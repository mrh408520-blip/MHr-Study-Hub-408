import { getAdminSession } from '@/lib/adminAuth';
import { getDb } from '@/lib/mongodb';
import { getDriveCredentials, uploadToGoogleDrive } from '@/lib/googleDrive';
import { ObjectId } from 'mongodb';

function normalizeModuleList(modules = []) {
  return modules.map((module) => ({
    title: module.title || 'Module',
    videos: Array.isArray(module.videos) ? module.videos : [],
  }));
}

export async function GET(request, { params }) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const { courseId } = resolvedParams || {};
  if (!courseId) {
    return Response.json({ error: 'Course id is required.' }, { status: 400 });
  }

  const db = await getDb();
  const course = await db.collection('courses').findOne({
    $or: [{ _id: ObjectId.isValid(courseId) ? new ObjectId(courseId) : courseId }, { slug: courseId }],
  });

  if (!course) {
    return Response.json({ modules: [] }, { status: 200 });
  }

  return Response.json({ modules: normalizeModuleList(course.modules || []) });
}

export async function POST(request, { params }) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const { courseId } = resolvedParams || {};
  if (!courseId) {
    return Response.json({ error: 'Course id is required.' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const moduleTitle = String(formData.get('moduleTitle') || 'Module 1');
  const videoTitle = String(formData.get('title') || file?.name || 'Untitled lesson');

  if (!file || typeof file === 'string') {
    return Response.json({ error: 'A video file is required.' }, { status: 400 });
  }

  try {
    const { folderId } = getDriveCredentials();
    const driveFile = await uploadToGoogleDrive(file, folderId);

    const db = await getDb();
    const courseFilter = {
      $or: [{ _id: ObjectId.isValid(courseId) ? new ObjectId(courseId) : courseId }, { slug: courseId }],
    };
    const course = await db.collection('courses').findOne(courseFilter);

    const existingModules = Array.isArray(course?.modules) ? course.modules : [];
    const targetIndex = existingModules.findIndex((module) => String(module.title).toLowerCase() === String(moduleTitle).toLowerCase());

    const nextVideo = {
      title: videoTitle,
      duration: '00:00',
      status: 'Published',
      uploadedAt: new Date(),
      source: driveFile.webViewLink || driveFile.webContentLink || '',
      fileId: driveFile.id || '',
      mimeType: driveFile.mimeType || file.type || 'video/mp4',
      size: driveFile.size || String(file.size || 0),
    };

    const nextModules = [...existingModules];
    if (targetIndex >= 0) {
      nextModules[targetIndex] = {
        ...nextModules[targetIndex],
        videos: [...(nextModules[targetIndex].videos || []), nextVideo],
      };
    } else {
      nextModules.push({
        title: moduleTitle,
        videos: [nextVideo],
      });
    }

    await db.collection('courses').updateOne(
      courseFilter,
      {
        $set: {
          modules: nextModules,
          updatedAt: new Date(),
        },
      },
      { upsert: false }
    );

    return Response.json({
      success: true,
      message: 'Video uploaded successfully.',
      file: {
        ...nextVideo,
        id: driveFile.id,
      },
      module: moduleTitle,
      modules: nextModules,
    });
  } catch (error) {
    return Response.json({
      error: error.message || 'Unable to upload video to Google Drive.',
    }, { status: 500 });
  }
}
