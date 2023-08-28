SIZE=${2:-4096}


DEST=${3:-./src/keys/}


PRIK=private_key.pem
PUBK=public_key.pub
if [ ! -d ./src/keys ]; then
  mkdir -p ./src/keys;
fi

# If either exists, avoid overwrite
if [ -f "$DEST$PRIK" ] || [ -f "$DEST$PUBK" ]; then
	echo "A key by that name already exists"
	exit 0
fi


openssl genrsa -out $DEST$PRIK $SIZE 
openssl rsa -in $DEST$PRIK -pubout -out $DEST$PUBK

exit
