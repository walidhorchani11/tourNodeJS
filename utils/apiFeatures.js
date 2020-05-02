class ApiFeatures {
    constructor(queryRequest, queryMongoose){
        this.queryRequest = queryRequest;
        this.queryMongoose = queryMongoose;
    }

    filter(){
        // 1 - faire une copie de req.query, cet copie on va le nettoyer cad
        // enlever les excludedFields comme limit, sort ...si nn on va avoir 0 results,
        // pcq ces fields n'existe plus comme champs dans schema mongoose 
        let queryObj = {...this.queryRequest};
        //exemple de req.query = queryObj = {
        //  duration: "5",
        //  price: {
        //      gte: "250"
        //   }
        //   limit: 10,
        //   sort : -ratingAverage,price
        //}
        // 
        const excludedFields = ['sort', 'fields', 'limit', 'page']
        //maper ce tableau et enlever leurs occurence dans queryObj
        // on peut traiter un objet comme array
        excludedFields.map(elem => delete queryObj[elem]);

        // 2 - 2eme etape consiste a mettre le signe $ pour les operators gte, gt, lte, lt
        //postman : localhost:../../..?price[gte]=250
        // alors, on va convertit lobjet to string
        let queryStr = JSON.stringify(queryObj);
        //on cherche les mots gte, gt, lte, lt, et on ajoute le signe $
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        //on sauvegarde dans queryMongoose le query returne par Find
        
        this.queryMongoose =  this.queryMongoose.find(JSON.parse(queryStr));

        // on return toute l'objet pour avoir la possibilite de chainage
        return this;
    };

    sort(){
        if(this.queryRequest.sort){
            // on va avoir le req.query.sort comme ceci=  sort: "-duration,price"
            //alors on doit replacer les comma(,) par espace
            const sortedBy = this.queryRequest.sort.split(',').join(' ');
            this.queryMongoose.sort(sortedBy);
        }else{
            this.queryMongoose.sort('-createdAt');
        }

        return this;
    };

    paginate(){
        const page = this.queryRequest.page * 1 || 1;
        const limit = this.queryRequest.limit * 1 || 5;
        //page 1, 1-5/ page 2, 6-10/ page 3; 11-15
        const skip = (page -1) * limit;

        // not necessary
        // if(skip >= await TourModel.countDocuments()){
            //on test si on demande une page inexistant, 
            //cad qu on va skiper tous les docs existant,
            // cad skip sera >= le nombre du docs
           // throw new Error('page introuvable !'); 
         // }

        this.queryMongoose.skip(skip).limit(limit);

        return this;
    };

    select() {

        if(this.queryRequest.fields){
            // on recoi le req.query comme ceci= fields :"name,duration,-rating"
            // so on va le formatter, enlever comma and repmace it by space
            const selectFields = this.queryRequest.fields.split(',').join(' ');
            this.queryMongoose.select(selectFields);

      // le signe moin (-) pour exclure ce champs, il ne sera pas retourne
      //il exist aussi au niveau du schema mongoose une option pour exclure un champ
      // qui s'appel select: false

            return this;
        }else{
            //si on ne select pas alors on va exclure __v avec le signe -
            this.queryMongoose.select('-__v');
        }
        return this;
    }


}

module.exports = ApiFeatures;
