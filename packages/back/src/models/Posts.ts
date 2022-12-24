import mongoose, { Schema, Model } from "mongoose";

/**
 * @swagger
 *  components:
 *  schemas:
 *   Product:
 *     properties:
 *      _id:
 *        type: string
 *      productNameKO:
 *        type: string
 *      productNameEN:
 *        type: string
 *      productType:
 *        type: object
 *        properties:
 *          selectors:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              code:
 *                type: string
 *          price:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              quantity:
 *                type: number
 *              value:
 *                type: number
 */

/**
 * @swagger
 * paths:
 *   /posts:
 *    post:
 *      tags: [제품]
 *      summary: 제품의 명칭과 셀렉트, 카테고리를 POST요청
 *      description: 제품의 국,영문 명칭과 셀렉트, 카테고리를 요청해서 관리자페이지에 랜더
 *      parameters:
 *        - name: productNameKO
 *          in: body
 *          description: 제품 국문 이름
 *          enum: [연필 깍기, 명함]
 *          example: 공구류
 *        - name: productNameEN
 *          in: body
 *          description: 제품 영문 이름 이 부분이 나중에 url 끝부분이 됨
 *          enum: [hotsource]
 *          example: hotsource
 *      responses:
 *        200:
 *          description: OK 들어 간 데이터가 다시 반환
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *        400:
 *          description: Invalid request
 *        409:
 *          description: Not have that kind of product
 */

interface Post {
  image: string;
  title: string;
  subTitle: string;
  date: string;
  tags: Array<String>;
}

// Static 정의
interface PostMethods extends Model<Post> {
  postSchemaStatic(): number;
  findAll(): any;
}

// Method 정의
// interface PostMethods extends Model<Post> {
// postSchemaMethod(): number;
// }

// type PostMethodModel = Model<Post, {}, PostMethods>;

const PostSchema: Schema = new Schema<Post>({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
});

// 메서드 정의
PostSchema.method("postSchemaMethod", function () {
  console.log(this);
  // 각종 쿼리식
  return 23;
});

// static 정의
PostSchema.static("postSchemaStatic", function () {
  return 42;
});

PostSchema.statics.findAll = () => {
  // PostSchema.statics.findAll = () => {
  // console.log(this);
  // console.log(this.find({}));
  console.log(this);
  // return this.find({});
};

export default mongoose.model<Post, PostMethods>("posts", PostSchema);
